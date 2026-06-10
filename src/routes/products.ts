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

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowed.includes(ext)) return cb(null, true)
    cb(new Error('Only image files allowed (jpg, jpeg, png, gif, webp, svg)'))
  },
})

// Public: get all products
router.get('/', async (_req, res: Response) => {
  const db = await getDb()
  const rows = queryAll(db, 'SELECT * FROM products ORDER BY id ASC')
  res.json(rows)
})

// Public: get single product
router.get('/:id', async (req, res: Response) => {
  const db = await getDb()
  const rows = queryAll(db, 'SELECT * FROM products WHERE id = ?', [Number(req.params.id)])
  if (rows.length === 0) return res.status(404).json({ error: 'Not found' })
  res.json(rows[0])
})

// Public: get featured products
router.get('/data/featured', async (_req, res: Response) => {
  const db = await getDb()
  const rows = queryAll(db, "SELECT * FROM products WHERE featured = 1 ORDER BY sales_rank ASC")
  res.json(rows)
})

// Admin: image upload
router.post('/upload', authMiddleware, (req: AuthRequest, res: Response) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) return res.status(400).json({ error: err.message })
      return res.status(400).json({ error: err.message })
    }
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
    res.json({ path: `/uploads/${req.file.filename}`, filename: req.file.filename })
  })
})

// Admin: create product
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { name, category_id, category, description, material, finishing, sizing, color_scheme, top_type, model_number, badge, image, price, sale_price, featured } = req.body
  if (!name) return res.status(400).json({ error: 'Product name is required' })
  const db = await getDb()
  db.run(`INSERT INTO products (name, category_id, category, description, material, finishing, sizing, color_scheme, top_type, model_number, badge, image, price, sale_price, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, category_id || null, category || '', description || '', material || '', finishing || '', sizing || '', color_scheme || '', top_type || '', model_number || '', badge || '', image || '', price || 0, sale_price || null, featured ? 1 : 0])
  saveDb()
  const rows = queryAll(db, 'SELECT * FROM products ORDER BY id DESC LIMIT 1')
  res.status(201).json(rows[0])
})

// Admin: update product
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const db = await getDb()
  const existing = queryAll(db, 'SELECT id FROM products WHERE id = ?', [Number(req.params.id)])
  if (existing.length === 0) return res.status(404).json({ error: 'Not found' })
  const { name, category_id, category, description, material, finishing, sizing, color_scheme, top_type, model_number, badge, image, price, sale_price, featured } = req.body
  db.run(`UPDATE products SET name=?, category_id=?, category=?, description=?, material=?, finishing=?, sizing=?, color_scheme=?, top_type=?, model_number=?, badge=?, image=?, price=?, sale_price=?, featured=?, updated_at=datetime('now') WHERE id=?`,
    [name, category_id || null, category || '', description, material, finishing, sizing, color_scheme, top_type, model_number, badge, image, price || 0, sale_price || null, featured ? 1 : 0, Number(req.params.id)])
  saveDb()
  const rows = queryAll(db, 'SELECT * FROM products WHERE id = ?', [Number(req.params.id)])
  res.json(rows[0])
})

// Admin: delete product
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const db = await getDb()
  db.run('DELETE FROM products WHERE id = ?', [Number(req.params.id)])
  saveDb()
  res.json({ success: true })
})

export default router
