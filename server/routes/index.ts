import { Router } from 'express'
import { apiRoutes } from './api.routes'
import { sitemapRoutes } from './sitemap.routes'

const router = Router()

router.use('/api', apiRoutes)
router.use(sitemapRoutes)

export { router as routes }
