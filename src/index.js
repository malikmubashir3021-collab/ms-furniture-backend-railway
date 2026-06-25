import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from './db.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import collectionRoutes from './routes/collections.js';
import uploadRoutes from './routes/upload.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const imagesDir = path.join(__dirname, '..', 'uploads', 'images');
fs.mkdirSync(imagesDir, { recursive: true });

app.use('/images', express.static(imagesDir));

app.use('/images', (req, res, next) => {
  const filename = req.path.replace(/^\//, '');
  if (!filename || filename.includes('..') || filename.includes('/')) return next();
  const filePath = path.join(imagesDir, filename);
  fetch(`https://msfurniturelahore.com/images/${encodeURIComponent(filename)}`).then(r => {
    if (!r.ok) return next();
    res.set('Content-Type', r.headers.get('content-type') || 'image/webp');
    return r.arrayBuffer().then(buf => {
      fs.writeFileSync(filePath, Buffer.from(buf));
      res.end(Buffer.from(buf));
    });
  }).catch(() => next());
});

app.use('/admin', express.static(path.join(__dirname, '..', 'admin', 'dist')));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'admin', 'dist', 'index.html'));
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/debug-image/:name', async (req, res) => {
  try {
    const r = await fetch(`https://msfurniturelahore.com/images/${req.params.name}`);
    res.json({ status: r.status, ok: r.ok, type: r.headers.get('content-type') });
  } catch (e) {
    res.json({ error: e.message });
  }
});

app.post('/api/reseed', (req, res) => {
  try {
    seedData();
    res.json({ message: 'Reseed complete' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

function seedData() {
  function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  const adminExists = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
  if (!adminExists) {
    const hashed = bcrypt.hashSync('admin123', 10);
    db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run('admin', hashed);
    console.log('Default admin user created: admin / admin123');
  }

  const seedPath = path.join(__dirname, 'products.json');
  if (!fs.existsSync(seedPath)) return;

  const products = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));
  const categoryNames = [...new Set(products.map(p => p.category).filter(Boolean))];

  const insertCategory = db.prepare('INSERT OR IGNORE INTO categories (name, slug, description, image, display_order) VALUES (?, ?, ?, ?, ?)');
  const getCategory = db.prepare('SELECT id FROM categories WHERE name = ?');

  for (let i = 0; i < categoryNames.length; i++) {
    insertCategory.run(categoryNames[i], slugify(categoryNames[i]), '', '', i + 1);
  }

  const insertProduct = db.prepare(`
    INSERT OR REPLACE INTO products (id, name, slug, category_id, category, description, material, finishing, sizing, color_scheme, top_type, model_number, badge, image, images, price, sale_price, featured, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `);

  const insertMany = db.transaction((prods) => {
    for (const p of prods) {
      const catRow = getCategory.get(p.category);
      insertProduct.run(
        p.id, p.name, slugify(p.name),
        catRow?.id || null, p.category || '',
        p.description || '', p.material || '',
        p.finishing || '', p.sizing || '',
        p.color_scheme || '', p.top_type || '',
        p.model_number || '', p.badge || '',
        p.image || '', '[]',
        0, null, p.badge === 'best-seller' ? 1 : 0,
        p.date_added || null
      );
    }
  });

  try {
    insertMany(products);
    console.log(`Seeded ${products.length} products across ${categoryNames.length} categories`);
  } catch (e) {
    console.error('Seed error:', e.message);
  }
}

app.listen(PORT, () => {
  console.log(`MS Furniture backend running on http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin`);
  seedData();
});
