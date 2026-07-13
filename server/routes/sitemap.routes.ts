import { Router } from 'express'
import { getAllSitemap, getSitemapIndex } from '../controllers/sitemap.controller'

const router = Router()

router.get('/sitemap_index.xml', getSitemapIndex)
router.get('/sitemap.xml', getAllSitemap)
router.get('/sitemap-pages.xml', (req, res, next) => {
  req.query = { ...req.query, type: 'pages' }
  getAllSitemap(req, res)
})
router.get('/sitemap-images.xml', (req, res, next) => {
  req.query = { ...req.query, type: 'images' }
  getAllSitemap(req, res)
})

export { router as sitemapRoutes }
