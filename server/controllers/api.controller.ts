import type { Request, Response } from 'express'

export function getHealth(_req: Request, res: Response) {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
}

export function getProjects(_req: Request, res: Response) {
  res.json({ projects: [] })
}
