import { Router, Response } from 'express'
import { getDb, saveDb } from '../db.js'
import { authMiddleware, AuthRequest } from '../midware/auth.js'
import { queryAll } from '../helpers.js'

const router = Router()

// Public: get all categories
router.get('/', async (_req, res: Response) => {
  const db = await getDb()
  const rows = queryAll(db, 'SELECT * FROM categories ORDER BY display_order ASC, name ASC')
  res.json(rows)
})

// Public: get single category
router.get('/:id', async (req, res: Response) => {
  const db = await getDb()
  const rows = queryAll(db, 'SELECT * FROM categories WHERE id = ?', [Number(req.params.id)])
  if (rows.length === 0) return res.status(404).json({ error: 'Not found' })
  res.json(rows[0])
})

// Admin: create category
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { name, image, description, display_order } = req.body
  if (!name) return res.status(400).json({ error: 'Category name is required' })
  const db = await getDb()
  const exists = queryAll(db, 'SELECT id FROM categories WHERE name = ?', [name])
  if (exists.length > 0) return res.status(409).json({ error: 'Category already exists' })
  db.run('INSERT INTO categories (name, image, description, display_order) VALUES (?, ?, ?, ?)',
    [name, image || '', description || '', display_order || 0])
  saveDb()
  const rows = queryAll(db, 'SELECT * FROM categories ORDER BY id DESC LIMIT 1')
  res.status(201).json(rows[0])
})

// Admin: update category
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
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

// Admin: delete category
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const db = await getDb()
  db.run('DELETE FROM categories WHERE id = ?', [Number(req.params.id)])
  saveDb()
  res.json({ success: true })
})

export default router
