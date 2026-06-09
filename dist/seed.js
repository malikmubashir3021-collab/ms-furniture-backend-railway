import bcrypt from 'bcryptjs';
import { getDb, saveDb } from './db.js';
import { initSchema } from './schema.js';
// @ts-expect-error - JS module without types
import rawProducts from './seed-data.js';
export async function seed() {
    await initSchema();
    const db = await getDb();
    const user = db.exec('SELECT id FROM users LIMIT 1');
    if (user.length === 0 || user[0].values.length === 0) {
        const hash = bcrypt.hashSync('msadmin2026', 10);
        db.run('INSERT INTO users (username, password) VALUES (?, ?)', ['admin', hash]);
        console.log('Admin user created: admin / msadmin2026');
    }
    else {
        console.log('Admin user already exists');
    }
    const cats = db.exec('SELECT id FROM categories LIMIT 1');
    if (cats.length === 0 || cats[0].values.length === 0) {
        const categories = [
            ['Coffee Tables', 'Coffee Tables'],
            ['Coffee Sets', 'Coffee Sets'],
            ['Sofa Set', 'Sofa Set'],
            ['Bed Set', 'Bed Set'],
        ];
        for (const [id, label] of categories) {
            db.run('INSERT INTO categories (id, label) VALUES (?, ?)', [id, label]);
        }
        console.log('Categories seeded');
    }
    else {
        console.log('Categories already exist');
    }
    const prods = db.exec('SELECT id FROM products LIMIT 1');
    if (prods.length === 0 || prods[0].values.length === 0) {
        const products = rawProducts;
        const stmt = db.prepare('INSERT INTO products (id, name, category, description, material, finishing, sizing, color_scheme, top_type, model_number, badge, image, date_added, sales_rank) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        for (const p of products) {
            stmt.bind([p.id, p.name, p.category, p.description, p.material, p.finishing, p.sizing, p.color_scheme, p.top_type, p.model_number, p.badge, p.image, p.date_added, p.sales_rank]);
            stmt.step();
            stmt.reset();
        }
        stmt.free();
        console.log(`${products.length} products seeded`);
    }
    else {
        console.log('Products already exist — skipping');
    }
    saveDb();
    console.log('Seed complete');
}
// Allow running directly as CLI
const isMain = process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js');
if (isMain) {
    seed().catch(console.error);
}
