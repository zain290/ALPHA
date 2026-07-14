import type { Request, Response } from 'express'
import db from '../db'

const RATE_LIMIT = Number(process.env.RATE_LIMIT_PER_HOUR) || 3

function getHourWindow(): string {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0, 0).toISOString()
}

function getDeviceKey(req: Request): string {
  const ip = req.ip || req.socket.remoteAddress || 'unknown'
  const deviceId = req.headers['x-device-id'] as string | undefined
  return deviceId ? `${ip}|${deviceId}` : ip
}

export async function chat(req: Request, res: Response) {
  const { messages } = req.body

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'messages array is required' })
    return
  }

  try {
    const deviceKey = getDeviceKey(req)
    const windowStart = getHourWindow()

    const row = db.prepare(
      'SELECT request_count FROM rate_limits WHERE device_key = ? AND window_start = ?'
    ).get(deviceKey, windowStart) as { request_count: number } | undefined
    const requestCount = row?.request_count || 0

    if (requestCount >= RATE_LIMIT) {
      res.status(429).json({
        error: `Rate limit exceeded. ${RATE_LIMIT} chat requests per hour allowed. Please try again later.`,
        remaining: 0,
        limit: RATE_LIMIT,
      })
      return
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      console.error('GROQ_API_KEY is not configured')
      res.status(503).json({ error: 'Chat service is temporarily unavailable.' })
      return
    }

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
        messages,
        max_tokens: Number(process.env.GROQ_MAX_TOKENS) || 1000,
      }),
    })

    if (!groqRes.ok) {
      const errorText = await groqRes.text()
      console.error('Groq API error:', groqRes.status, errorText)
      res.status(503).json({ error: 'Chat service is temporarily unavailable.' })
      return
    }

    const groqData = await groqRes.json() as {
      choices: Array<{ message: { content: string } }>
    }

    const text = groqData.choices?.[0]?.message?.content

    if (!text) {
      res.status(503).json({ error: 'Chat service is temporarily unavailable.' })
      return
    }

    db.prepare(`
      INSERT INTO rate_limits (device_key, window_start, request_count)
      VALUES (?, ?, 1)
      ON CONFLICT(device_key, window_start) DO UPDATE SET request_count = request_count + 1
    `).run(deviceKey, windowStart)

    const remaining = Math.max(0, RATE_LIMIT - requestCount - 1)

    res.json({
      choices: [{ message: { content: text } }],
      remaining,
      limit: RATE_LIMIT,
    })
  } catch (error) {
    console.error('Chat error:', error)
    res.status(503).json({ error: 'Chat service is temporarily unavailable.' })
  }
}
