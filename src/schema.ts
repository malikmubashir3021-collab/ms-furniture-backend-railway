import { getDb, saveDb } from './db.js'

export async function initSchema() {
  const db = await getDb()
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      image TEXT DEFAULT '',
      description TEXT DEFAULT '',
      display_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)
  db.run(`
    CREATE TABLE IF NOT EXISTS collections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT DEFAULT '',
      image TEXT DEFAULT '',
      display_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)
  db.run(`
    CREATE TABLE IF NOT EXISTS collection_products (
      collection_id INTEGER NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      display_order INTEGER DEFAULT 0,
      PRIMARY KEY (collection_id, product_id)
    )
  `)
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      category TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      material TEXT NOT NULL DEFAULT '',
      finishing TEXT NOT NULL DEFAULT '',
      sizing TEXT NOT NULL DEFAULT '',
      color_scheme TEXT NOT NULL DEFAULT '',
      top_type TEXT NOT NULL DEFAULT '',
      model_number TEXT NOT NULL DEFAULT '',
      badge TEXT DEFAULT '',
      image TEXT NOT NULL DEFAULT '',
      price REAL DEFAULT 0,
      sale_price REAL,
      featured INTEGER DEFAULT 0,
      date_added TEXT DEFAULT (datetime('now')),
      sales_rank INTEGER DEFAULT 999,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `)
  saveDb()
  console.log('Schema initialized')
}
