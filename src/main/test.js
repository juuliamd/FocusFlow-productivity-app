import Database from 'better-sqlite3';
const db = new Database('focusflow.db');

// Projekty
db.prepare(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
  )
`).run();

const insertProject = db.prepare('INSERT INTO projects (name, description) VALUES (?, ?)');
const allProjects = db.prepare('SELECT * FROM projects');

// Zadania
db.prepare(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY,
    project_id INTEGER,
    title TEXT NOT NULL,
    done INTEGER DEFAULT 0,
    FOREIGN KEY(project_id) REFERENCES projects(id)
  )
`).run();

const insertTask = db.prepare('INSERT INTO tasks (project_id, title, done) VALUES (?, ?, ?)');
const allTasks = db.prepare('SELECT * FROM tasks');

// 🧪 Testowanie logiki
insertProject.run('Projekt A', 'Opis projektu A');
insertTask.run(1, 'Zadanie 1', 0);
insertTask.run(null, 'Luźne zadanie', 0);

console.log('Projekty:', allProjects.all());
console.log('Zadania:', allTasks.all());
