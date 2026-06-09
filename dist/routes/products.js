import { Router } from 'express';
import { getDb, saveDb } from '../db.js';
import { authMiddleware } from '../midware/auth.js';
import { queryAll } from '../helpers.js';
const router = Router();
// Public: get all products
router.get('/', async (_req, res) => {
    const db = await getDb();
    const rows = queryAll(db, 'SELECT * FROM products ORDER BY id ASC');
    res.json(rows);
});
// Public: get single product
router.get('/:id', async (req, res) => {
    const db = await getDb();
    const rows = queryAll(db, 'SELECT * FROM products WHERE id = ?', [Number(req.params.id)]);
    if (rows.length === 0)
        return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
});
// Public: get categories
router.get('/data/categories', async (_req, res) => {
    const db = await getDb();
    const rows = queryAll(db, 'SELECT * FROM categories');
    res.json(rows);
});
// Admin: create product
router.post('/', authMiddleware, async (req, res) => {
    const { name, category, description, material, finishing, sizing, color_scheme, top_type, model_number, badge, image } = req.body;
    if (!name || !category)
        return res.status(400).json({ error: 'Name and category required' });
    const db = await getDb();
    db.run('INSERT INTO products (name, category, description, material, finishing, sizing, color_scheme, top_type, model_number, badge, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [name, category, description || '', material || '', finishing || '', sizing || '', color_scheme || '', top_type || '', model_number || '', badge || '', image || '']);
    saveDb();
    const rows = queryAll(db, 'SELECT * FROM products ORDER BY id DESC LIMIT 1');
    res.status(201).json(rows[0]);
});
// Admin: update product
router.put('/:id', authMiddleware, async (req, res) => {
    const db = await getDb();
    const existing = queryAll(db, 'SELECT id FROM products WHERE id = ?', [Number(req.params.id)]);
    if (existing.length === 0)
        return res.status(404).json({ error: 'Not found' });
    const { name, category, description, material, finishing, sizing, color_scheme, top_type, model_number, badge, image } = req.body;
    db.run(`UPDATE products SET name=?, category=?, description=?, material=?, finishing=?, sizing=?, color_scheme=?, top_type=?, model_number=?, badge=?, image=?, updated_at=datetime('now') WHERE id=?`, [name, category, description, material, finishing, sizing, color_scheme, top_type, model_number, badge, image, Number(req.params.id)]);
    saveDb();
    const rows = queryAll(db, 'SELECT * FROM products WHERE id = ?', [Number(req.params.id)]);
    res.json(rows[0]);
});
// Admin: delete product
router.delete('/:id', authMiddleware, async (req, res) => {
    const db = await getDb();
    db.run('DELETE FROM products WHERE id = ?', [Number(req.params.id)]);
    saveDb();
    res.json({ success: true });
});
export default router;
