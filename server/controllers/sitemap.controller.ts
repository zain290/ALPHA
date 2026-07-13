import type { Request, Response } from 'express'
import db from '../db'

const BASE_URL = 'https://alpha.pro'

const staticPages = [
  { path: '/', priority: 1.0, changefreq: 'daily' as const },
  { path: '/create', priority: 0.9, changefreq: 'daily' as const },
  { path: '/about', priority: 0.8, changefreq: 'weekly' as const },
  { path: '/contact', priority: 0.7, changefreq: 'monthly' as const },
  { path: '/privacy-policy', priority: 0.4, changefreq: 'monthly' as const },
  { path: '/terms', priority: 0.4, changefreq: 'monthly' as const },
]

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function generateUrlXml(path: string, priority: number, changefreq: string, lastmod?: string): string {
  const now = lastmod || new Date().toISOString()
  return `  <url>
    <loc>${escapeXml(BASE_URL + path)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`
}

export function getSitemapIndex(_req: Request, res: Response) {
  const sitemaps = [
    { path: '/sitemap-pages.xml', lastmod: new Date().toISOString() },
    { path: '/sitemap-images.xml', lastmod: new Date().toISOString() },
  ]

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`
  for (const s of sitemaps) {
    xml += `  <sitemap>
    <loc>${escapeXml(BASE_URL + s.path)}</loc>
    <lastmod>${s.lastmod}</lastmod>
  </sitemap>
`
  }
  xml += `</sitemapindex>`

  res.set('Content-Type', 'application/xml')
  res.send(xml)
}

export function getPagesSitemap(_req: Request, res: Response) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`
  for (const page of staticPages) {
    xml += generateUrlXml(page.path, page.priority, page.changefreq) + '\n'
  }
  xml += `</urlset>`

  res.set('Content-Type', 'application/xml')
  res.send(xml)
}

export function getImagesSitemap(_req: Request, res: Response) {
  const images = db.prepare('SELECT id, created_at FROM images ORDER BY created_at DESC').all() as { id: number; created_at: string }[]

  const maxImages = 1000

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`
  const slice = images.slice(0, maxImages)
  for (const img of slice) {
    xml += generateUrlXml(`/image/${img.id}`, 0.3, 'weekly', img.created_at) + '\n'
  }
  xml += `</urlset>`

  res.set('Content-Type', 'application/xml')
  res.send(xml)
}

export function getAllSitemap(req: Request, res: Response) {
  const type = req.query.type as string | undefined
  if (type === 'pages') return getPagesSitemap(req, res)
  if (type === 'images') return getImagesSitemap(req, res)

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`
  for (const page of staticPages) {
    xml += generateUrlXml(page.path, page.priority, page.changefreq) + '\n'
  }

  const images = db.prepare('SELECT id, created_at FROM images ORDER BY created_at DESC LIMIT 1000').all() as { id: number; created_at: string }[]
  for (const img of images) {
    xml += generateUrlXml(`/image/${img.id}`, 0.3, 'weekly', img.created_at) + '\n'
  }

  xml += `</urlset>`

  res.set('Content-Type', 'application/xml')
  res.send(xml)
}
