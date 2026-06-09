export function queryAll(db, sql, params = []) {
    const stmt = db.prepare(sql);
    if (params.length)
        stmt.bind(params);
    const rows = [];
    while (stmt.step()) {
        const vals = stmt.get();
        const cols = stmt.getColumnNames();
        const row = {};
        cols.forEach((col, i) => { row[col] = vals[i]; });
        rows.push(row);
    }
    stmt.free();
    return rows;
}
