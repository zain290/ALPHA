import type { Request, Response } from 'express'

const pageContent: Record<string, object> = {
  'site-ui': {
    lets_work_together_text: "Let's work together",
  },
  about: {
    hero_line1: 'We create',
    hero_line2: 'digital experiences',
    products_title: 'Our Work',
    products_paragraphs: [],
    services_items: [],
    faqs: [],
    cta_title: 'Start creating today.',
    cta_button_text: 'Open Studio',
    cta_button_link: '/create',
  },
  terms: {
    hero_line1: 'Terms of Service',
    hero_line2: '',
    sections: [
      {
        label: 'introduction',
        title: 'Introduction',
        paragraphs: ['These terms govern your use of our services.'],
      },
    ],
  },
  'privacy-policy': {
    hero_line1: 'Privacy Policy',
    hero_line2: '',
    sections: [
      {
        label: 'introduction',
        title: 'Introduction',
        paragraphs: ['We respect your privacy and are committed to protecting your personal data.'],
      },
    ],
  },
}

export function getPage(req: Request, res: Response) {
  const { slug } = req.params
  const content = pageContent[slug] || null
  res.json({ content, updated_at: new Date().toISOString() })
}
