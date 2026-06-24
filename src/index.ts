import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { getDb, saveDb } from './db.js'
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

app.get('/api/run-migration', async (_req, res) => {
  try {
    const db = await getDb()
    const catRows = db.exec('SELECT id, name FROM categories')
    const catMap: Record<string, number> = {}
    for (const row of catRows[0].values) {
      catMap[row[1] as string] = row[0] as number
    }
    const { default: rawProducts } = await import('./seed-data.js') as any
    const featuredIds = [1, 3, 36, 54, 49, 46, 21]
    let count = 0
    for (const p of rawProducts as any[]) {
      const catId = catMap[p.category] ?? null
      const isFeatured = featuredIds.includes(p.id) ? 1 : 0
      db.run('UPDATE products SET category_id = ?, featured = ? WHERE id = ?', [catId, isFeatured, p.id])
      count++
    }
    saveDb()
    const sample = db.exec('SELECT id, name, category_id, featured FROM products LIMIT 10')
    res.json({ updated: count, sample: sample[0]?.values })
  } catch (err: any) {
    res.status(500).json({ error: err.message, stack: err.stack })
  }
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

async function start() {
  await initSchema()

  const db = await getDb()
  const users = db.exec('SELECT id FROM users LIMIT 1')
  if (users.length === 0 || users[0].values.length === 0) {
    console.log('First run — seeding database...')
    const { seed } = await import('./seed.js')
    await seed()
  }

  // Migrate existing products: set category_id and featured
  try {
    const db = await getDb()
    const products = db.exec('SELECT id, category_id, featured FROM products LIMIT 5')
    console.log('Pre-migration sample:', JSON.stringify(products[0]?.values))
    const catRows = db.exec('SELECT id, name FROM categories')
    console.log('Categories:', JSON.stringify(catRows[0]?.values))
    if (catRows.length > 0) {
      const { default: rawProducts } = await import('./seed-data.js') as any
      const catMap: Record<string, number> = {}
      for (const row of catRows[0].values) {
        catMap[row[1] as string] = row[0] as number
      }
      console.log('catMap:', JSON.stringify(catMap))
      const sampleProduct = (rawProducts as any[])[0]
      console.log('Sample product category:', JSON.stringify(sampleProduct?.category), 'type:', typeof sampleProduct?.category)
      const featuredIds = [1, 3, 36, 54, 49, 46, 21]
      let count = 0
      for (const p of rawProducts as any[]) {
        const catId = catMap[p.category] ?? null
        const isFeatured = featuredIds.includes(p.id) ? 1 : 0
        db.run('UPDATE products SET category_id = ?, featured = ? WHERE id = ?', [catId, isFeatured, p.id])
        count++
      }
      saveDb()
      console.log(`Migration: ${count} products updated`)
      const check = db.exec('SELECT id, category_id, featured FROM products LIMIT 5')
      console.log('Post-migration sample:', JSON.stringify(check[0]?.values))
    }
  } catch (err: any) {
    console.error('Migration error:', err.message)
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start().catch(console.error)
