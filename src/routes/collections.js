import { Router } from 'express';
import { db, slugify } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const collections = db.prepare('SELECT * FROM collections ORDER BY name ASC').all();
    res.json(collections);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
});

router.post('/', authenticateToken, (req, res) => {
  try {
    const { name, description, image } = req.body;
    if (!name) return res.status(400).json({ error: 'Collection name is required' });

    const slug = slugify(name);
    const result = db.prepare('INSERT INTO collections (name, slug, description, image) VALUES (?, ?, ?, ?)')
      .run(name, slug, description || '', image || '');

    const collection = db.prepare('SELECT * FROM collections WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(collection);
  } catch (error) {
    if (error.message?.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Collection already exists' });
    }
    res.status(500).json({ error: 'Failed to create collection' });
  }
});

export default router;
