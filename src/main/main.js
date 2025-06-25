// src/main/main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./databases/db');

const {
  createProject,
  getAllProjects,
  updateProject,
  deleteProject
} = require('./databases/projects.js');

const {
  createTask,
  getAllTasks,
  getTasksByProject,
  getTasksByProjectId,
  updateTasks,
  deleteTask
} = require('./databases/tasks.js');


function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  win.loadURL('http://localhost:5173');
}

app.whenReady().then(createWindow);

// PROJECT HANDLERS
ipcMain.handle('create-project', (e, project) => {
  const {
    name,
    description,
    due_date = null,
    priority = 'medium',
    status = 'todo',
    estimated_minutes=null,
    notes=''
  } = project;
  if (!name.trim()) throw new Error('Nieprawidłowa nazwa projektu');
  return createProject(name, description, due_date, priority, status, estimated_minutes, notes);
});

ipcMain.handle('get-all-projects', () => getAllProjects());

ipcMain.handle('update-project', (e, project) => {
  const {
    id,
    name,
    description = '',
    due_date = null,
    priority = 'medium',
    status = 'todo',
    estimated_minutes = null,
    notes='',
  } = project;
  if (!id || !name.trim()) throw new Error('Nieprawidłowe dane projektu');
  return updateProject(id, name, description, due_date, priority, status, estimated_minutes, notes);
});

ipcMain.handle('delete-project', (e, id) => deleteProject(id));

// TASK HANDLERS 
ipcMain.handle('create-task', (e, task) => createTask(
  task.title, task.description, task.status, task.due_date, task.priority, task.project_id
));
ipcMain.handle('get-all-tasks', () => getAllTasks());
ipcMain.handle('get-tasks-by-project', (e, id) => getTasksByProject(id));
ipcMain.handle('update-tasks', (e, id, updates) => updateTasks(id, updates));
ipcMain.handle('delete-task', (e, id) => deleteTask(id));
ipcMain.handle('get-tasks-by-project-id', (e, projectId) => {
  return getTasksByProjectId(projectId);
})

// CALENDAR HANDLERS
ipcMain.handle('get-calendar-events', ()=> {
  const tasks = db.prepare(`
    SELECT id, title, due_date, 'task' AS type FROM tasks WHERE due_date IS NOT NULL
  `).all();
  const projects = db.prepare(`
    SELECT id, name AS title, due_date, 'project' AS type FROM projects WHERE due_date IS NOT NULL
  `).all();

  return [...tasks, ...projects];
});

ipcMain.handle('get-work-slots', ()=>{
  return db.prepare('SELECT * FROM work_slots').all();
});

ipcMain.handle('add-work-slot', (e, slot) => {
  const stmt = db.prepare(`
    INSERT INTO work_slots (date, start_time, end_time, recurring)
    VALUES (?, ?, ?, ?)
  `);
  const info = stmt.run(slot.date, slot.start_time, slot.end_time, slot.recurring || null);
  return { id: info.lastInsertRowid };
});

ipcMain.handle('update-work-slot', (e, slot) => {
  const stmt= db.prepare(`
    UPDATE work_slots
    SET date=?, start_time=?, end_time=?, recurring=?
    WHERE id=?
    `);
    return stmt.run(slot.date, slot.start_time, slot.end_time, slot.recurring || null, slot.id);
});

ipcMain.handle('delete-work-slot', (e, id) => {
  return db.prepare('DELETE FROM work_slots WHERE id = ?').run(id);
});

//PRZYPISYWANIE ZADAN HANDLERS

ipcMain.handle('save-task-assignments', (e, assignments)=>{
  const insert = db.prepare(`
    INSERT INTO task_assignments (task_id, type, date, start_time, end_time)
    VALUES (?, ?, ?, ?, ?)
    `)
    const clear = db.prepare(`DELETE FROM task_assignments`);
    const tx = db.transaction(()=>{
      clear.run();
      for (const a of assignments){
        insert.run(a.task_id, a.type, a.date, a.start_time, a.end_time);
      }
    });
    tx();
});

ipcMain.handle('get-task-assignments', ()=> {
  return db.prepare(`SELECT * FROM task_assignments`).all();
});

ipcMain.handle(`clear-task-assignments`, ()=>{
  return db.prepare(`DELETE FROM task_assignments`).run();
})




app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
