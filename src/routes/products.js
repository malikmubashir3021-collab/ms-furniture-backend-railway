import { Router } from 'express';
import { db, slugify } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all();
    const parsed = products.map(p => ({
      ...p,
      images: JSON.parse(p.images || '[]'),
      featured: !!p.featured
    }));
    res.json(parsed);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    product.images = JSON.parse(product.images || '[]');
    product.featured = !!product.featured;
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

router.post('/', authenticateToken, (req, res) => {
  try {
    const {
      name, category_id, category, description, material, finishing,
      sizing, color_scheme, top_type, model_number, badge,
      image, images, price, sale_price, featured
    } = req.body;

    if (!name) return res.status(400).json({ error: 'Product name is required' });

    const slug = slugify(name) + '-' + Date.now();
    const imagesJson = JSON.stringify(images || []);

    const result = db.prepare(`
      INSERT INTO products (name, slug, category_id, category, description, material,
        finishing, sizing, color_scheme, top_type, model_number, badge,
        image, images, price, sale_price, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name, slug, category_id || null, category || '', description || '',
      material || '', finishing || '', sizing || '', color_scheme || '',
      top_type || '', model_number || '', badge || '',
      image || '', imagesJson, price || 0, sale_price || null, featured ? 1 : 0
    );

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    product.images = JSON.parse(product.images || '[]');
    product.featured = !!product.featured;
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

router.put('/:id', authenticateToken, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    const {
      name, category_id, category, description, material, finishing,
      sizing, color_scheme, top_type, model_number, badge,
      image, images, price, sale_price, featured
    } = req.body;

    const imagesJson = JSON.stringify(images !== undefined ? images : JSON.parse(existing.images || '[]'));

    db.prepare(`
      UPDATE products SET
        name = ?, category_id = ?, category = ?, description = ?,
        material = ?, finishing = ?, sizing = ?, color_scheme = ?,
        top_type = ?, model_number = ?, badge = ?,
        image = ?, images = ?, price = ?, sale_price = ?,
        featured = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(
      name || existing.name,
      category_id !== undefined ? category_id : existing.category_id,
      category !== undefined ? category : existing.category,
      description !== undefined ? description : existing.description,
      material !== undefined ? material : existing.material,
      finishing !== undefined ? finishing : existing.finishing,
      sizing !== undefined ? sizing : existing.sizing,
      color_scheme !== undefined ? color_scheme : existing.color_scheme,
      top_type !== undefined ? top_type : existing.top_type,
      model_number !== undefined ? model_number : existing.model_number,
      badge !== undefined ? badge : existing.badge,
      image !== undefined ? image : existing.image,
      imagesJson,
      price !== undefined ? price : existing.price,
      sale_price !== undefined ? sale_price : existing.sale_price,
      featured !== undefined ? (featured ? 1 : 0) : existing.featured,
      req.params.id
    );

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    product.images = JSON.parse(product.images || '[]');
    product.featured = !!product.featured;
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    res.json({ message: 'Product deleted', id: parseInt(req.params.id) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
