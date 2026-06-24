import { getDb, saveDb } from './db.js'
import rawProducts from './seed-data.js'

export async function migrate() {
  const db = await getDb()

  const catRows = db.exec('SELECT id, name FROM categories')
  if (catRows.length > 0) {
    const catMap: Record<string, number> = {}
    for (const row of catRows[0].values) {
      catMap[row[1] as string] = row[0] as number
    }

    const featuredIds = [1, 3, 36, 54, 49, 46, 21]
    let updated = 0

    for (const p of rawProducts) {
      const catId = catMap[p.category] || null
      const isFeatured = featuredIds.includes(p.id) ? 1 : 0
      db.run('UPDATE products SET category_id = ?, featured = ? WHERE id = ?', [catId, isFeatured, p.id])
      updated++
    }

    saveDb()
    console.log(`Migration: ${updated} products updated with category links and featured flags`)
  }
}
