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

export async function generateImage(req: Request, res: Response) {
  const { prompt } = req.body as GenerateRequest

  if (!prompt) {
    res.status(400).json({ error: 'prompt is required' })
    return
  }

  try {
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

    res.json({ imageUrl, id: result.lastInsertRowid })
  } catch (error) {
    console.error('Generation failed:', error)
    res.status(500).json({ error: 'Image generation failed' })
  }
}