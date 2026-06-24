import { Router, Response } from 'express'
import { getDb, saveDb } from '../db.js'
import { authMiddleware, AuthRequest } from '../midware/auth.js'
import { queryAll } from '../helpers.js'
const router = Router()

function attachImages(db: any, product: any) {
  if (!product) return product
  const images = queryAll(db, 'SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order ASC', [product.id])
  product.images = images.map((i: any) => i.image_path)
  return product
}

function attachProductsImages(db: any, products: any[]) {
  if (!products.length) return products
  const ids = products.map((p: any) => p.id)
  const placeholders = ids.map(() => '?').join(',')
  const allImages = queryAll(db, `SELECT * FROM product_images WHERE product_id IN (${placeholders}) ORDER BY display_order ASC`, ids)
  const map: Record<number, string[]> = {}
  for (const img of allImages) {
    if (!map[img.product_id]) map[img.product_id] = []
    map[img.product_id].push(img.image_path)
  }
  for (const p of products) {
    p.images = map[p.id] || []
  }
  return products
}

// Public: get all products
router.get('/', async (_req, res: Response) => {
  const db = await getDb()
  const rows = queryAll(db, 'SELECT * FROM products ORDER BY id ASC')
  res.json(attachProductsImages(db, rows))
})

// Public: get single product
router.get('/:id', async (req, res: Response) => {
  const db = await getDb()
  const rows = queryAll(db, 'SELECT * FROM products WHERE id = ?', [Number(req.params.id)])
  if (rows.length === 0) return res.status(404).json({ error: 'Not found' })
  res.json(attachImages(db, rows[0]))
})

// Public: get featured products
router.get('/data/featured', async (_req, res: Response) => {
  const db = await getDb()
  const rows = queryAll(db, "SELECT * FROM products WHERE featured = 1 ORDER BY sales_rank ASC")
  res.json(attachProductsImages(db, rows))
})

// Admin: create product
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, category_id, category, description, material, finishing, sizing, color_scheme, top_type, model_number, badge, image, price, sale_price, featured, images } = req.body
    if (!name) return res.status(400).json({ error: 'Product name is required' })
    const db = await getDb()
    db.run(`INSERT INTO products (name, category_id, category, description, material, finishing, sizing, color_scheme, top_type, model_number, badge, image, price, sale_price, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, category_id || null, category || '', description || '', material || '', finishing || '', sizing || '', color_scheme || '', top_type || '', model_number || '', badge || '', image || '', price || 0, sale_price || null, featured ? 1 : 0])
    const rows = queryAll(db, 'SELECT * FROM products ORDER BY id DESC LIMIT 1')
    const product = rows[0]
    if (images && Array.isArray(images)) {
      for (let i = 0; i < images.length; i++) {
        db.run('INSERT INTO product_images (product_id, image_path, display_order) VALUES (?, ?, ?)', [product.id, images[i], i])
      }
    }
    saveDb()
    res.status(201).json(attachImages(db, product))
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// Admin: update product
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDb()
    const existing = queryAll(db, 'SELECT id FROM products WHERE id = ?', [Number(req.params.id)])
    if (existing.length === 0) return res.status(404).json({ error: 'Not found' })
    const { name, category_id, category, description, material, finishing, sizing, color_scheme, top_type, model_number, badge, image, price, sale_price, featured, images } = req.body
    db.run(`UPDATE products SET name=?, category_id=?, category=?, description=?, material=?, finishing=?, sizing=?, color_scheme=?, top_type=?, model_number=?, badge=?, image=?, price=?, sale_price=?, featured=?, updated_at=datetime('now') WHERE id=?`,
      [name, category_id || null, category || '', description || '', material || '', finishing || '', sizing || '', color_scheme || '', top_type || '', model_number || '', badge || '', image || '', price || 0, sale_price || null, featured ? 1 : 0, Number(req.params.id)])
    if (images && Array.isArray(images)) {
      db.run('DELETE FROM product_images WHERE product_id = ?', [Number(req.params.id)])
      for (let i = 0; i < images.length; i++) {
        db.run('INSERT INTO product_images (product_id, image_path, display_order) VALUES (?, ?, ?)', [Number(req.params.id), images[i], i])
      }
    }
    saveDb()
    const rows = queryAll(db, 'SELECT * FROM products WHERE id = ?', [Number(req.params.id)])
    res.json(attachImages(db, rows[0]))
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// Admin: delete product
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDb()
    db.run('DELETE FROM product_images WHERE product_id = ?', [Number(req.params.id)])
    db.run('DELETE FROM products WHERE id = ?', [Number(req.params.id)])
    saveDb()
    res.json({ success: true })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

export default router
