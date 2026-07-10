import type { Request, Response } from 'express'

const defaultSettings = {
  contact_email: 'zemz.pro@gmail.com',
  cta_button_text: 'Get in touch',
  cta_title: 'Start creating today.',
}

export function getSettings(_req: Request, res: Response) {
  res.json(defaultSettings)
}
