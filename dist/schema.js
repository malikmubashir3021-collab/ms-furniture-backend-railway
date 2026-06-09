import { getDb, saveDb } from './db.js';
export async function initSchema() {
    const db = await getDb();
    db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
    db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL
    )
  `);
    db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL REFERENCES categories(id),
      description TEXT NOT NULL DEFAULT '',
      material TEXT NOT NULL DEFAULT '',
      finishing TEXT NOT NULL DEFAULT '',
      sizing TEXT NOT NULL DEFAULT '',
      color_scheme TEXT NOT NULL DEFAULT '',
      top_type TEXT NOT NULL DEFAULT '',
      model_number TEXT NOT NULL DEFAULT '',
      badge TEXT DEFAULT '',
      image TEXT NOT NULL DEFAULT '',
      date_added TEXT DEFAULT (datetime('now')),
      sales_rank INTEGER DEFAULT 999,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);
    saveDb();
    console.log('Schema initialized');
}
