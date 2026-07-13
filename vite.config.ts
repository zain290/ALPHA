import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5328,
    proxy: { '/api': 'http://localhost:5329', '/uploads': 'http://localhost:5329', '/sitemap_index.xml': 'http://localhost:5329', '/sitemap.xml': 'http://localhost:5329', '/sitemap-pages.xml': 'http://localhost:5329', '/sitemap-images.xml': 'http://localhost:5329' },
  },
})
// trigger restart
