
const db= require('./db');
const path = require('path');

db.prepare(`
   CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        due_date TEXT,
        priority TEXT DEFAULT 'medium',
        status TEXT DEFAULT 'todo',
        estimated_minutes INTEGER,
        notes TEXT

    )`).run();
    try {
  db.prepare(`ALTER TABLE projects ADD COLUMN notes TEXT`).run();
  console.log('✅ Migracja: kolumna notes dodana');
} catch (e) {
  if (e.message.includes('duplicate column name')) {
    // już masz tę kolumnę — ignoruj
  } else {
    console.error('❌ Błąd migracji:', e);
  }
}
console.log('Ładuję bazę z:', path.join(__dirname, 'focusflow.db'));


//CREATE
function createProject(name, description,due_date = null, priority = 'medium', status ='todo', estimated_minutes=null, notes) {
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO projects (name, description, created_at, updated_at, due_date, priority, status, estimated_minutes, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(name, description, now, now,due_date,priority,status, estimated_minutes, notes);
  return info.lastInsertRowid;
}

//READ(wszystkie projekty)

function getAllProjects() {
    return db.prepare(`SELECT * FROM projects`).all();
}

//READ(projekty z określonym id)
function getProjectById(id) {
    return db.prepare(`SELECT * FROM projects WHERE id = ?`).get(id);
}

//UPDATE
function updateProject(id, name, description, due_date, priority, status, estimated_minutes, notes) {
    const now = new Date().toISOString();
    db.prepare(`
      UPDATE projects
      SET name=?, description=?, updated_at=?, due_date=?, priority=?, status=?, estimated_minutes=?, notes=?
      WHERE id=?
    `).run(name, description, now, due_date, priority, status,estimated_minutes,notes, id);
  }
  

//DELETE
function deleteProject(id) {
    db.prepare(`DELETE FROM projects WHERE id=?`).run(id);
    }

module.exports ={
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject
};