 function createTables(db) {
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
        
      )
    `).run();
  
    db.prepare(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'todo',
        due_date TEXT,
        priority TEXT DEFAULT 'medium',
        project_id INTEGER,
        estimated_minutes INTEGER,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
      )
    `).run();

    db.prepare(`
      CREATE TABLE IF NOT EXISTS work_slots (
      id INTEGER PRIMARY KEY,
      date TEXT,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      recurring TEXT
      )
    `).run();

    db.prepare(`
      CREATE TABLE IF NOT EXISTS task_assignments (
      id INTEGER PRIMARY KEY,
      task_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
      )
      `).run();
  }
  module.exports={createTables};
  