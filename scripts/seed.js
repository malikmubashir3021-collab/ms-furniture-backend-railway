import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'data', 'msfurniture.db');

fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  DROP TABLE IF EXISTS collection_products;
  DROP TABLE IF EXISTS products;
  DROP TABLE IF EXISTS collections;
  DROP TABLE IF EXISTS categories;
  DROP TABLE IF EXISTS users;

  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE,
    description TEXT DEFAULT '',
    image TEXT DEFAULT '',
    display_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE collections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE,
    description TEXT DEFAULT '',
    image TEXT DEFAULT '',
    display_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE collection_products (
    collection_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    PRIMARY KEY (collection_id, product_id),
    FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  );

  CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    category_id INTEGER,
    category TEXT DEFAULT '',
    description TEXT DEFAULT '',
    material TEXT DEFAULT '',
    finishing TEXT DEFAULT '',
    sizing TEXT DEFAULT '',
    color_scheme TEXT DEFAULT '',
    top_type TEXT DEFAULT '',
    model_number TEXT DEFAULT '',
    badge TEXT DEFAULT '',
    image TEXT DEFAULT '',
    images TEXT DEFAULT '[]',
    price REAL DEFAULT 0,
    sale_price REAL DEFAULT NULL,
    featured INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
  );
`);

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const hashedPassword = bcrypt.hashSync('admin123', 10);
db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)').run('admin', hashedPassword, 'admin');

const productsPath = path.join(__dirname, 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

const categoryNames = [...new Set(products.map(p => p.category).filter(Boolean))];

const insertCategory = db.prepare('INSERT INTO categories (name, slug, description, image, display_order) VALUES (?, ?, ?, ?, ?)');
const getCategory = db.prepare('SELECT id FROM categories WHERE name = ?');

for (let i = 0; i < categoryNames.length; i++) {
  insertCategory.run(categoryNames[i], slugify(categoryNames[i]), '', '', i + 1);
}

const insertProduct = db.prepare(`
  INSERT INTO products (id, name, slug, category_id, category, description, material, finishing, sizing, color_scheme, top_type, model_number, badge, image, images, price, sale_price, featured, created_at, updated_at)
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

insertMany(products);

console.log(`Seeded: 1 admin user, ${categoryNames.length} categories, ${products.length} products`);
db.close();
