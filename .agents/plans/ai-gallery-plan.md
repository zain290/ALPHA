---
title: AI Gallery - Implementation Plan
tags:
  - plan
  - migration
  - ai-gallery
---

# AI Gallery — Implementation Plan

> Based on [[ZEMZ Frontend]] architecture, rebranded for AI image generation & gallery.

## Overview

Rename `zemz-frontend` → `ai-gallery`. Rebrand from a digital agency site to an **AI Image Gallery** app that uses **Groq cloud models** to generate images, stores them, and displays them across 3 pages.

## Pages

| Path | Page | Description | ZEMZ Origin |
|------|------|-------------|-------------|
| `/` | **Home** (showcase) | Orbiting image gallery with rotating rings + center glow | Copied from `Work.tsx` style |
| `/create` | **AI Chatbot** | Chat interface → image generation via Groq API → store results | New |
| `/gallery` | **Gallery** | Grid of all generated/stored images with preview | New |

## Color Scheme (same as ZEMZ)

- `--color-primary`: `#E8391D` (signature red)
- Light: white bg, dark text | Dark: black bg, white text
- Same CSS vars, dark mode via `html.dark` class

## Implementation Steps

### 1. Rename project files
- `package.json`: `"name": "ai-gallery"`
- `index.html`: title → "AI Gallery"
- `src/utils/constants.ts`: `SITE_NAME` → "AI Gallery"
- `README.md`: rebrand

### 2. Rebrand references
- `Header.tsx`: logo text "AI Gallery"
- `Footer.tsx`: logo text "AI Gallery"
- Nav links: Work → Showcase, Services → Create, Approach → Gallery, About → (remove)

### 3. Update routing (`App.tsx`)
- `/` → Home (showcase with orbit gallery)
- `/create` → AIChatbot page (new)
- `/gallery` → Gallery page (new)
- Remove `/about` and `/contact`

### 4. Showcase Page (`/` ← Home.tsx)
- Copy the Work page's rotating orbit gallery pattern:
  - Outer ring: 3+ images, 50s clockwise rotation
  - Inner ring: 3+ images, 35s counter-clockwise rotation
  - Center: pulsing glow with `animate-ping`
- Gradient heading "AI Gallery"
- SEO: title "AI Gallery | Showcase"

### 5. AI Chatbot Page (`/create`)
- Chat-style interface with message bubbles
- Input field for text prompts
- "Generate" button → calls Groq API endpoint
- Generated image preview in chat
- Loading/streaming state
- Save button → stores to backend
- SEO: title "AI Gallery | Create"

### 6. Gallery Page (`/gallery`)
- Grid/masonry layout of all generated images
- Each card: image thumbnail + prompt + date
- Click to enlarge / view details
- Empty state when no images
- SEO: title "AI Gallery | Gallery"

### 7. Backend updates (`server/`)
- Add `/api/images` route: GET (list all), POST (save new), DELETE
- Database table: `images` with columns: `id`, `prompt`, `url`, `created_at`
- Groq API integration endpoint: `/api/generate` → POST to Groq, return image URL

### 8. Nav updates
- Header: Showcase, Create, Gallery (replacing Work, Services, Approach, About)
- Footer: same three links

## Files to Create
- `src/pages/Create.tsx` — AI Chatbot page
- `src/pages/Gallery.tsx` — Gallery page
- `server/routes/images.routes.ts` — Image CRUD
- `server/controllers/images.controller.ts` — Image handlers
- `server/controllers/generate.controller.ts` — Groq integration

## Files to Modify
- `package.json` — rename
- `index.html` — title
- `src/App.tsx` — routing
- `src/components/layout/Header.tsx` — nav + brand
- `src/components/layout/Footer.tsx` — nav + brand
- `src/utils/constants.ts` — SITE_NAME
- `src/pages/Home.tsx` — showcase orbit gallery
- `server/routes/index.ts` — add image routes
- `server/routes/api.routes.ts` — add endpoints
- `README.md` — rebrand
- `src/services/api.ts` — add image/generate methods

## Data Flow

```text
User prompt → Create page → /api/generate → Groq API → image URL
                                                              ↓
Gallery page ← /api/images ← saved to DB ← Create page saves
```

## Groq Integration

Endpoint: `POST https://api.groq.com/openai/v1/chat/completions` (or Groq's image generation endpoint)
Headers: `Authorization: Bearer GROQ_API_KEY`
Model: `mixtral-8x7b-32768` or image-specific model

> Note: Groq primarily provides LLM inference. For image generation, we'll use a placeholder integration that can be swapped with any image API (e.g., Stability AI, DALL-E, or Groq's future image capabilities).
