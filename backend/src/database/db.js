import Database from 'better-sqlite3'

export const db = new Database('src/database/db.sqlite')

export const initDB = async () => {
  db.prepare(`
      CREATE TABLE IF NOT EXISTS lists (id TEXT PRIMARY KEY, title TEXT)
    `).run()
  db.prepare(
    `CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT, 
      status BOOLEAN DEFAULT FALSE,
      due_date TEXT,
      list_id TEXT,
      FOREIGN KEY (list_id) REFERENCES lists(id)
    )`).run()

  // Seeding 
  db.prepare(`
    INSERT OR IGNORE INTO lists (id, title) VALUES 
      ('0000000001', 'Career goals'),
      ('0000000002', 'Personal goals')
    `).run()
  db.prepare(`
    INSERT OR IGNORE INTO todos (id, text, status, due_date, list_id) VALUES
      (1, 'Land job at Sellpy', 0, '2025-09-20', '0000000001'),
      (2, 'Get promotion', 0, NULL, '0000000001'),
      (3, 'Cook delicious veggie burgers', 1, NULL, '0000000002')
    `).run()
}