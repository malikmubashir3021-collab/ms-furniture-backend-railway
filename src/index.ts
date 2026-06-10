import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { getDb } from './db.js'
import { initSchema } from './schema.js'
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import adminRoutes from './routes/admin.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
const PORT = Number(process.env.PORT) || 3001

const allowedOrigins = ['https://msfurniturelahore.com', 'http://localhost:5173', 'http://localhost:3001']

app.use(cors({
  origin: (origin, cb) => { cb(null, !origin || allowedOrigins.includes(origin) ? true : false) },
}))

app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))
app.use('/admin', express.static(path.join(__dirname, '..', 'admin', 'dist')))

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api', adminRoutes)

app.get('/admin/*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'admin', 'dist', 'index.html'))
})

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

async function start() {
  await initSchema()

  const db = await getDb()
  const users = db.exec('SELECT id FROM users LIMIT 1')
  if (users.length === 0 || users[0].values.length === 0) {
    console.log('First run — seeding database...')
    const { seed } = await import('./seed.js')
    await seed()
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start().catch(console.error)
