import type { Request, Response } from 'express'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import { fileURLToPath } from 'url'
import db from '../db'

interface GenerateRequest {
  prompt?: string
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const UPLOADS_DIR = path.resolve(__dirname, '..', 'data', 'uploads')
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true })
}

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

export async function generateImage(req: Request, res: Response) {
  const { prompt } = req.body as GenerateRequest

  if (!prompt) {
    res.status(400).json({ error: 'prompt is required' })
    return
  }

  try {
    const deviceKey = getDeviceKey(req)
    const windowStart = getHourWindow()

    const row = db.prepare('SELECT request_count FROM rate_limits WHERE device_key = ? AND window_start = ?').get(deviceKey, windowStart) as { request_count: number } | undefined
    const requestCount = row?.request_count || 0

    if (requestCount >= RATE_LIMIT) {
      res.status(429).json({
        error: `Rate limit exceeded. ${RATE_LIMIT} images per hour allowed. Please try again later.`,
        remaining: 0,
        limit: RATE_LIMIT,
      })
      return
    }

    db.prepare(`
      INSERT INTO rate_limits (device_key, window_start, request_count)
      VALUES (?, ?, 1)
      ON CONFLICT(device_key, window_start) DO UPDATE SET request_count = request_count + 1
    `).run(deviceKey, windowStart)
    const seed = prompt.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
    const hue = seed % 360
    const hex = hue.toString(16).padStart(6, '0')
    const placeholderUrl = `https://placehold.co/512x512/${hex}/ffffff?text=${encodeURIComponent(prompt.slice(0, 20))}`

    const response = await fetch(placeholderUrl)
    if (!response.ok || !response.body) {
      throw new Error('Failed to fetch placeholder image')
    }

    const hash = crypto.createHash('md5').update(prompt + Date.now()).digest('hex').slice(0, 12)
    const filename = `${hash}.png`
    const filePath = path.join(UPLOADS_DIR, filename)

    const writer = fs.createWriteStream(filePath)
    const reader = response.body.getReader()

    const pump = async () => {
      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          writer.end()
          break
        }
        writer.write(Buffer.from(value))
      }
    }
    await pump()

    await new Promise<void>((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', reject)
    })

    const imageUrl = `/uploads/${filename}`

    const stmt = db.prepare('INSERT INTO images (prompt, url) VALUES (?, ?)')
    const result = stmt.run(prompt, imageUrl)

    const remaining = Math.max(0, RATE_LIMIT - requestCount - 1)

    res.json({ imageUrl, id: result.lastInsertRowid, remaining, limit: RATE_LIMIT })
  } catch (error) {
    console.error('Generation failed:', error)
    res.status(500).json({ error: 'Image generation failed' })
  }
}