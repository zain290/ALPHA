import { Router } from 'express'
import { getHealth } from '../controllers/api.controller'
import { getImages, saveImage, deleteImage } from '../controllers/images.controller'
import { generateImage } from '../controllers/generate.controller'
import { getSettings } from '../controllers/settings.controller'
import { getPage } from '../controllers/pages.controller'
import { chat } from '../controllers/chat.controller'

const router = Router()

router.get('/health', getHealth)
router.get('/images', getImages)
router.post('/images', saveImage)
router.delete('/images/:id', deleteImage)
router.post('/generate', generateImage)
router.get('/settings', getSettings)
router.get('/pages/:slug', getPage)
router.post('/chat', chat)

export { router as apiRoutes }
