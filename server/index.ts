import { App } from './app'

const PORT = Number(process.env.PORT) || 3001
const app = new App()
app.start(PORT)
