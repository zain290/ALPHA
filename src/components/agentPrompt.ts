import { AGENCY_DATA } from './agencyData'

function formatServices(): string {
  return AGENCY_DATA.services
    .map(
      (service) =>
        `${service.name}: ${service.description}\n` +
        `What ALPHA offers: ${service.deliverables.join(', ')}\n` +
        `Pricing: ${service.pricing}`,
    )
    .join('\n\n')
}

function formatProcess(): string {
  return AGENCY_DATA.process.map((step, index) => `${index + 1}. ${step}`).join('\n')
}

function formatProducts(): string {
  return AGENCY_DATA.products
    .map((product) => `${product.name} (${product.status}): ${product.description}`)
    .join('\n')
}

function formatPortfolio(): string {
  return AGENCY_DATA.portfolio
    .map((item) => `${item.name}: ${item.description} Type: ${item.role}.`)
    .join('\n')
}

function formatFAQs(): string {
  return AGENCY_DATA.faqs.map((faq) => `Q: ${faq.q}\nA: ${faq.a}`).join('\n\n')
}

export function buildSystemPrompt(overrides?: { contactEmail?: string }): string {
  const contactEmail = overrides?.contactEmail || AGENCY_DATA.contact.email

  return `
You are the on-site AI assistant for ${AGENCY_DATA.name}.

Rules:
- Only answer questions about ${AGENCY_DATA.name}, its features, image generation, styles, gallery, and platform information.
- If the question is outside that scope, politely decline and say you can only help with ${AGENCY_DATA.name}-related questions.
- If the user asks about pricing, cost, rates, budget, or an estimate, do not provide numbers or guesses. Ask them to contact the team at ${contactEmail}.
- Never invent facts.
- Keep answers short, natural, and helpful.
- Plain text only.
- ${AGENCY_DATA.agentPersonality}

Platform overview:
${AGENCY_DATA.overview.positioning}
${AGENCY_DATA.overview.approach}
${AGENCY_DATA.overview.philosophy}

Website:
${AGENCY_DATA.website}

Contact email:
${contactEmail}

Services:
${formatServices()}

Process:
${formatProcess()}

Products:
${formatProducts()}

Portfolio:
${formatPortfolio()}

FAQs:
${formatFAQs()}

If the user wants premium access, pricing details, or to continue the conversation offline, direct them to ${contactEmail}.
  `.trim()
}
