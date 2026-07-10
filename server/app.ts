import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { routes } from './routes'
import { errorHandler } from './middleware/error.middleware'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export class App {
  private app: express.Application

  constructor() {
    this.app = express()
    this.configureMiddleware()
    this.registerRoutes()
    this.registerErrorHandler()
  }

  private configureMiddleware() {
    this.app.use(cors())
    this.app.use(express.json({ limit: '50mb' }))
    this.app.use(express.urlencoded({ limit: '50mb', extended: true }))
    const uploadsDir = path.resolve(__dirname, '..', 'data', 'uploads')
    this.app.use('/uploads', express.static(uploadsDir))
  }

  private registerRoutes() {
    this.app.use(routes)
  }

  private registerErrorHandler() {
    this.app.use(errorHandler)
  }

  start(port: number) {
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  }
}
