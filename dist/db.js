import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd());
const DB_PATH = path.join(DATA_DIR, 'data.db');
let db;
export async function getDb() {
    if (db)
        return db;
    const SQL = await initSqlJs();
    if (fs.existsSync(DB_PATH)) {
        const buf = fs.readFileSync(DB_PATH);
        db = new SQL.Database(buf);
    }
    else {
        db = new SQL.Database();
    }
    db.run('PRAGMA foreign_keys = ON');
    return db;
}
export function saveDb() {
    if (!db)
        return;
    if (!fs.existsSync(DATA_DIR))
        fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DB_PATH, db.export());
}
