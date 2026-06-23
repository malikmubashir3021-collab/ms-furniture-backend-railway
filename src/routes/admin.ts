import { Router, Response } from 'express'
import { getDb, saveDb } from '../db.js'
import { authMiddleware, AuthRequest } from '../midware/auth.js'
import { queryAll } from '../helpers.js'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const router = Router()
const UPLOAD_DIR = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`)
  },
})
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } })

// === IMAGE UPLOAD (single) ===
router.post('/upload', authMiddleware, (req: AuthRequest, res: Response) => {
  upload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message })
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
    res.json({ path: `/uploads/${req.file.filename}`, filename: req.file.filename })
  })
})

// === IMAGE UPLOAD (multiple) ===
router.post('/upload-multiple', authMiddleware, (req: AuthRequest, res: Response) => {
  upload.array('images', 20)(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message })
    if (!req.files || !(req.files as Express.Multer.File[]).length) return res.status(400).json({ error: 'No files uploaded' })
    const files = req.files as Express.Multer.File[]
    const paths = files.map(f => ({ path: `/uploads/${f.filename}`, filename: f.filename }))
    res.json(paths)
  })
})

// === CATEGORIES ===
router.get('/categories', async (_req, res: Response) => {
  const db = await getDb()
  const rows = queryAll(db, 'SELECT * FROM categories ORDER BY display_order ASC, name ASC')
  res.json(rows)
})

router.post('/categories', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { name, image, description, display_order } = req.body
  if (!name) return res.status(400).json({ error: 'Category name is required' })
  const db = await getDb()
  db.run('INSERT INTO categories (name, image, description, display_order) VALUES (?, ?, ?, ?)',
    [name, image || '', description || '', display_order || 0])
  saveDb()
  const rows = queryAll(db, 'SELECT * FROM categories ORDER BY id DESC LIMIT 1')
  res.status(201).json(rows[0])
})

router.put('/categories/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const db = await getDb()
  const existing = queryAll(db, 'SELECT id FROM categories WHERE id = ?', [Number(req.params.id)])
  if (existing.length === 0) return res.status(404).json({ error: 'Not found' })
  const { name, image, description, display_order } = req.body
  db.run('UPDATE categories SET name=?, image=?, description=?, display_order=? WHERE id=?',
    [name, image || '', description || '', display_order || 0, Number(req.params.id)])
  saveDb()
  const rows = queryAll(db, 'SELECT * FROM categories WHERE id = ?', [Number(req.params.id)])
  res.json(rows[0])
})

router.delete('/categories/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const db = await getDb()
  db.run('DELETE FROM categories WHERE id = ?', [Number(req.params.id)])
  saveDb()
  res.json({ success: true })
})

// === COLLECTIONS ===
router.get('/collections', async (_req, res: Response) => {
  const db = await getDb()
  const rows = queryAll(db, `SELECT c.*, (SELECT COUNT(*) FROM collection_products cp WHERE cp.collection_id = c.id) as product_count FROM collections c ORDER BY c.display_order ASC, c.name ASC`)
  res.json(rows)
})

router.get('/collections/:id', async (req, res: Response) => {
  const db = await getDb()
  const rows = queryAll(db, 'SELECT * FROM collections WHERE id = ?', [Number(req.params.id)])
  if (rows.length === 0) return res.status(404).json({ error: 'Not found' })
  const products = queryAll(db, `SELECT p.* FROM products p JOIN collection_products cp ON cp.product_id = p.id WHERE cp.collection_id = ? ORDER BY cp.display_order ASC`, [Number(req.params.id)])
  rows[0].products = products
  res.json(rows[0])
})

router.post('/collections', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { name, description, image, display_order } = req.body
  if (!name) return res.status(400).json({ error: 'Collection name is required' })
  const db = await getDb()
  db.run('INSERT INTO collections (name, description, image, display_order) VALUES (?, ?, ?, ?)',
    [name, description || '', image || '', display_order || 0])
  saveDb()
  const rows = queryAll(db, 'SELECT * FROM collections ORDER BY id DESC LIMIT 1')
  res.status(201).json(rows[0])
})

router.put('/collections/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
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

router.delete('/collections/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const db = await getDb()
  db.run('DELETE FROM collections WHERE id = ?', [Number(req.params.id)])
  saveDb()
  res.json({ success: true })
})

router.post('/collections/:id/products', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { product_id } = req.body
  if (!product_id) return res.status(400).json({ error: 'product_id is required' })
  const db = await getDb()
  const existing = queryAll(db, 'SELECT id FROM collections WHERE id = ?', [Number(req.params.id)])
  if (existing.length === 0) return res.status(404).json({ error: 'Collection not found' })
  db.run('INSERT OR IGNORE INTO collection_products (collection_id, product_id) VALUES (?, ?)',
    [Number(req.params.id), product_id])
  saveDb()
  res.json({ success: true })
})

router.delete('/collections/:collectionId/products/:productId', authMiddleware, async (req: AuthRequest, res: Response) => {
  const db = await getDb()
  db.run('DELETE FROM collection_products WHERE collection_id = ? AND product_id = ?',
    [Number(req.params.collectionId), Number(req.params.productId)])
  saveDb()
  res.json({ success: true })
})

export default router
