import { Router } from 'express';
import { db, slugify } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const categories = db.prepare('SELECT * FROM categories ORDER BY display_order ASC, name ASC').all();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.post('/', authenticateToken, (req, res) => {
  try {
    const { name, description, image, display_order } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name is required' });

    const slug = slugify(name);
    const result = db.prepare('INSERT INTO categories (name, slug, description, image, display_order) VALUES (?, ?, ?, ?, ?)')
      .run(name, slug, description || '', image || '', display_order || 0);

    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(category);
  } catch (error) {
    if (error.message?.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Category already exists' });
    }
    res.status(500).json({ error: 'Failed to create category' });
  }
});

router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { name, description, image, display_order } = req.body;
    const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Category not found' });

    db.prepare(`
      UPDATE categories SET name = ?, slug = ?, description = ?, image = ?, display_order = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(
      name || existing.name,
      slugify(name || existing.name),
      description !== undefined ? description : existing.description,
      image !== undefined ? image : existing.image,
      display_order !== undefined ? display_order : existing.display_order,
      req.params.id
    );

    const updated = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
});

router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Category not found' });

    db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;
