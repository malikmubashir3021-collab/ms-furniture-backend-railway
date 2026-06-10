import { Router, Response } from 'express'
import { getDb, saveDb } from '../db.js'
import { authMiddleware, AuthRequest } from '../midware/auth.js'
import { queryAll } from '../helpers.js'

const router = Router()

// Public: get all collections with product count
router.get('/', async (_req, res: Response) => {
  const db = await getDb()
  const rows = queryAll(db, `
    SELECT c.*, (SELECT COUNT(*) FROM collection_products cp WHERE cp.collection_id = c.id) as product_count
    FROM collections c ORDER BY c.display_order ASC, c.name ASC
  `)
  res.json(rows)
})

// Public: get single collection with products
router.get('/:id', async (req, res: Response) => {
  const db = await getDb()
  const rows = queryAll(db, 'SELECT * FROM collections WHERE id = ?', [Number(req.params.id)])
  if (rows.length === 0) return res.status(404).json({ error: 'Not found' })
  const products = queryAll(db, `
    SELECT p.* FROM products p
    JOIN collection_products cp ON cp.product_id = p.id
    WHERE cp.collection_id = ?
    ORDER BY cp.display_order ASC
  `, [Number(req.params.id)])
  rows[0].products = products
  res.json(rows[0])
})

// Admin: create collection
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { name, description, image, display_order } = req.body
  if (!name) return res.status(400).json({ error: 'Collection name is required' })
  const db = await getDb()
  const exists = queryAll(db, 'SELECT id FROM collections WHERE name = ?', [name])
  if (exists.length > 0) return res.status(409).json({ error: 'Collection already exists' })
  db.run('INSERT INTO collections (name, description, image, display_order) VALUES (?, ?, ?, ?)',
    [name, description || '', image || '', display_order || 0])
  saveDb()
  const rows = queryAll(db, 'SELECT * FROM collections ORDER BY id DESC LIMIT 1')
  res.status(201).json(rows[0])
})

// Admin: update collection
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const db = await getDb()
  const existing = queryAll(db, 'SELECT id FROM collections WHERE id = ?', [Number(req.params.id)])
  if (existing.length === 0) return res.status(404).json({ error: 'Not found' })
  const { name, description, image, display_order } = req.body
  db.run('UPDATE collections SET name=?, description=?, image=?, display_order=? WHERE id=?',
    [name, description || '', image || '', display_order || 0, Number(req.params.id)])
  saveDb()
  const rows = queryAll(db, 'SELECT * FROM collections WHERE id = ?', [Number(req.params.id)])
  res.json(rows[0])
})

// Admin: delete collection
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const db = await getDb()
  db.run('DELETE FROM collections WHERE id = ?', [Number(req.params.id)])
  saveDb()
  res.json({ success: true })
})

// Admin: add product to collection
router.post('/:id/products', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { product_id } = req.body
  if (!product_id) return res.status(400).json({ error: 'product_id is required' })
  const db = await getDb()
  const exists = queryAll(db, 'SELECT id FROM collections WHERE id = ?', [Number(req.params.id)])
  if (exists.length === 0) return res.status(404).json({ error: 'Collection not found' })
  const prodExists = queryAll(db, 'SELECT id FROM products WHERE id = ?', [product_id])
  if (prodExists.length === 0) return res.status(404).json({ error: 'Product not found' })
  const already = queryAll(db, 'SELECT * FROM collection_products WHERE collection_id = ? AND product_id = ?',
    [Number(req.params.id), product_id])
  if (already.length > 0) return res.status(409).json({ error: 'Product already in collection' })
  db.run('INSERT INTO collection_products (collection_id, product_id) VALUES (?, ?)',
    [Number(req.params.id), product_id])
  saveDb()
  res.json({ success: true })
})

// Admin: remove product from collection
router.delete('/:collectionId/products/:productId', authMiddleware, async (req: AuthRequest, res: Response) => {
  const db = await getDb()
  db.run('DELETE FROM collection_products WHERE collection_id = ? AND product_id = ?',
    [Number(req.params.collectionId), Number(req.params.productId)])
  saveDb()
  res.json({ success: true })
})

export default router
