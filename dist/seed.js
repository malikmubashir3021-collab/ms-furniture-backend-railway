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
            { name: 'Coffee Tables', display_order: 1 },
            { name: 'Coffee Sets', display_order: 2 },
            { name: 'Sofa Set', display_order: 3 },
            { name: 'Bed Set', display_order: 4 },
        ];
        for (const c of categories) {
            db.run('INSERT INTO categories (name, display_order) VALUES (?, ?)', [c.name, c.display_order]);
        }
        console.log('Categories seeded');
    }
    else {
        console.log('Categories already exist');
    }
    const catRows = db.exec('SELECT id, name FROM categories');
    const catMap = {};
    if (catRows.length > 0) {
        for (const row of catRows[0].values) {
            catMap[row[1]] = row[0];
        }
    }
    const featuredIds = [1, 3, 36, 54, 49, 46, 21];
    const prods = db.exec('SELECT id FROM products LIMIT 1');
    if (prods.length === 0 || prods[0].values.length === 0) {
        const products = rawProducts;
        const stmt = db.prepare('INSERT INTO products (id, name, category_id, category, description, material, finishing, sizing, color_scheme, top_type, model_number, badge, image, date_added, sales_rank, price, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        for (const p of products) {
            const catId = catMap[p.category] || null;
            const isFeatured = featuredIds.includes(p.id) ? 1 : 0;
            stmt.bind([p.id, p.name, catId, p.category, p.description, p.material, p.finishing, p.sizing, p.color_scheme, p.top_type, p.model_number, p.badge, p.image, p.date_added, p.sales_rank, p.price || 0, isFeatured]);
            stmt.step();
            stmt.reset();
        }
        stmt.free();
        console.log(`${products.length} products seeded`);
    }
    else {
        console.log('Products already exist — updating category links and featured');
        const stmt = db.prepare('UPDATE products SET category_id = ?, featured = ? WHERE id = ?');
        for (const p of rawProducts) {
            const catId = catMap[p.category] || null;
            const isFeatured = featuredIds.includes(p.id) ? 1 : 0;
            stmt.bind([catId, isFeatured, p.id]);
            stmt.step();
            stmt.reset();
        }
        stmt.free();
        console.log('Products updated');
    }
    saveDb();
    console.log('Seed complete');
}
// Allow running directly as CLI
const isMain = process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js');
if (isMain) {
    seed().catch(console.error);
}
