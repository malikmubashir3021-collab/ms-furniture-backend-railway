import { Router } from 'express';
import { db, slugify } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const collections = db.prepare('SELECT * FROM collections ORDER BY display_order ASC, name ASC').all();
    res.json(collections);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const collection = db.prepare('SELECT * FROM collections WHERE id = ?').get(req.params.id);
    if (!collection) return res.status(404).json({ error: 'Collection not found' });

    const products = db.prepare(`
      SELECT p.id, p.name, p.image FROM products p
      INNER JOIN collection_products cp ON cp.product_id = p.id
      WHERE cp.collection_id = ?
      ORDER BY p.name ASC
    `).all(req.params.id);

    res.json({ ...collection, products });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch collection' });
  }
});

router.post('/', authenticateToken, (req, res) => {
  try {
    const { name, description, image, display_order } = req.body;
    if (!name) return res.status(400).json({ error: 'Collection name is required' });

    const slug = slugify(name);
    const result = db.prepare('INSERT INTO collections (name, slug, description, image, display_order) VALUES (?, ?, ?, ?, ?)')
      .run(name, slug, description || '', image || '', display_order || 0);

    const collection = db.prepare('SELECT * FROM collections WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(collection);
  } catch (error) {
    if (error.message?.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Collection already exists' });
    }
    res.status(500).json({ error: 'Failed to create collection' });
  }
});

router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { name, description, image, display_order } = req.body;
    const existing = db.prepare('SELECT * FROM collections WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Collection not found' });

    db.prepare(`
      UPDATE collections SET name = ?, slug = ?, description = ?, image = ?, display_order = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(
      name || existing.name,
      slugify(name || existing.name),
      description !== undefined ? description : existing.description,
      image !== undefined ? image : existing.image,
      display_order !== undefined ? display_order : existing.display_order,
      req.params.id
    );

    const updated = db.prepare('SELECT * FROM collections WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update collection' });
  }
});

router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM collections WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Collection not found' });

    db.prepare('DELETE FROM collections WHERE id = ?').run(req.params.id);
    res.json({ message: 'Collection deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete collection' });
  }
});

router.post('/:id/products', authenticateToken, (req, res) => {
  try {
    const { product_id } = req.body;
    if (!product_id) return res.status(400).json({ error: 'product_id is required' });

    const collection = db.prepare('SELECT * FROM collections WHERE id = ?').get(req.params.id);
    if (!collection) return res.status(404).json({ error: 'Collection not found' });

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(product_id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    db.prepare('INSERT OR IGNORE INTO collection_products (collection_id, product_id) VALUES (?, ?)')
      .run(req.params.id, product_id);

    res.status(201).json({ message: 'Product added to collection' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add product to collection' });
  }
});

router.delete('/:id/products/:productId', authenticateToken, (req, res) => {
  try {
    db.prepare('DELETE FROM collection_products WHERE collection_id = ? AND product_id = ?')
      .run(req.params.id, req.params.productId);
    res.json({ message: 'Product removed from collection' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove product from collection' });
  }
});

export default router;
