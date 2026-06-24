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

// Direct inline test route
app.get('/api/test-direct', (_req, res) => {
  res.json({ message: 'Direct route works!' })
})

app.get('/admin/*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'admin', 'dist', 'index.html'))
})

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', version: '2.0', routes: app._router?.stack?.filter?.((l: any) => l.route)?.length || 0 })
})

app.get('/api/test-categories', async (_req, res) => {
  try {
    const { queryAll } = await import('./helpers.js')
    const { getDb } = await import('./db.js')
    const db = await getDb()
    const rows = queryAll(db, 'SELECT * FROM categories ORDER BY rowid ASC')
    res.json({ success: true, count: rows.length, data: rows })
  } catch (err: any) {
    res.status(500).json({ error: err.message, stack: err.stack })
  }
})

app.get('/api/do-migration', async (_req, res) => {
  try {
    const { getDb, saveDb } = await import('./db.js')
    const { queryAll } = await import('./helpers.js')
    const db = await getDb()
    db.run("UPDATE products SET category_id = (SELECT id FROM categories WHERE categories.name = products.category)")
    db.run("UPDATE products SET featured = 1 WHERE id IN (1,3,36,54,49,46,21)")
    db.run("UPDATE products SET featured = 0 WHERE id NOT IN (1,3,36,54,49,46,21)")
    saveDb()
    const sample = queryAll(db, 'SELECT id, name, category_id, featured FROM products ORDER BY id LIMIT 10')
    const cats = queryAll(db, 'SELECT * FROM categories ORDER BY id')
    res.json({ message: 'done', sample, cats })
  } catch (err: any) {
    res.status(500).json({ error: err.message, stack: err.stack })
  }
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
