import type { Request, Response } from 'express'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'
import db from '../db'

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadsDir = path.resolve(__dirname, '..', '..', 'data', 'uploads')

function ensureUploadsDir() {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
  }
}

export function getImages(_req: Request, res: Response) {
  const images = db.prepare('SELECT * FROM images ORDER BY created_at DESC').all()
  res.json({ images })
}

export async function saveImage(req: Request, res: Response) {
  try {
    ensureUploadsDir()

    const { prompt, imageUrl, imageBase64 } = req.body as {
      prompt?: string
      imageUrl?: string
      imageBase64?: string
    }

    console.log('[saveImage] prompt:', prompt?.slice(0, 60))
    console.log('[saveImage] imageUrl:', imageUrl?.slice(0, 80) ?? 'none')
    console.log('[saveImage] base64 length:', imageBase64?.length ?? 'none')

    if (!prompt) {
      res.status(400).json({ error: 'prompt is required' })
      return
    }

    if (!imageUrl && !imageBase64) {
      res.status(400).json({ error: 'imageUrl or imageBase64 is required' })
      return
    }

    let buffer: Buffer
    let extension = 'jpg'

    if (imageUrl) {
      // Server-side download — no CORS issues
      console.log('[saveImage] Downloading from URL:', imageUrl)
      const response = await fetch(imageUrl)
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.status} ${response.statusText}`)
      }
      const contentType = response.headers.get('content-type') || ''
      if (contentType.includes('png')) extension = 'png'
      else if (contentType.includes('webp')) extension = 'webp'
      const arrayBuffer = await response.arrayBuffer()
      buffer = Buffer.from(arrayBuffer)
      console.log('[saveImage] Downloaded bytes:', buffer.length)
    } else {
      // Fallback: base64
      const matches = imageBase64!.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
      if (matches && matches.length === 3) {
        buffer = Buffer.from(matches[2], 'base64')
        const mimeType = matches[1]
        if (mimeType.includes('png')) extension = 'png'
        else if (mimeType.includes('webp')) extension = 'webp'
      } else {
        buffer = Buffer.from(imageBase64!, 'base64')
      }
      console.log('[saveImage] Decoded base64 bytes:', buffer.length)
    }

    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${extension}`
    const filePath = path.join(uploadsDir, filename)
    fs.writeFileSync(filePath, buffer)
    console.log('[saveImage] File written:', filePath)

    const finalUrl = `/uploads/${filename}`
    const stmt = db.prepare('INSERT INTO images (prompt, url) VALUES (?, ?)')
    const result = stmt.run(prompt, finalUrl)

    console.log('[saveImage] DB insert id:', result.lastInsertRowid, 'url:', finalUrl)
    res.json({ image: { id: result.lastInsertRowid, prompt, url: finalUrl } })
  } catch (err) {
    console.error('[saveImage] FATAL ERROR:', err)
    res.status(500).json({ error: 'Failed to save image', detail: (err as Error).message })
  }
}

export function deleteImage(req: Request, res: Response) {
  const id = Number(req.params.id)
  const stmt = db.prepare('DELETE FROM images WHERE id = ?')
  const result = stmt.run(id)
  if (result.changes === 0) {
    res.status(404).json({ error: 'Image not found' })
    return
  }
  res.json({ success: true })
}