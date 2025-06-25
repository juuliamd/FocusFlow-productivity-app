const db= require('./db');

//CREATE
function createTask(title, 
                    description,
                    status='todo', 
                    due_Date=null,
                    priority='medium', 
                    projectId =null,
                    estimated_minutes=null){
  const stmt = db.prepare(`
    INSERT INTO tasks (title, description,status, due_date,priority, project_id, estimated_minutes)
    VALUES (?, ?, ?, ?, ?, ?,?)
    `);
    const info=stmt.run(title, description,status, due_Date,priority, projectId, estimated_minutes);
    return {id: info.lastInsertRowid};
}


//READ
function getAllTasks(){
  return db.prepare(`SELECT * FROM tasks`).all();
}

function getTasksByProject(projectId){
  return db.prepare(`SELECT * FROM tasks WHERE project_id = ?`).all(projectId);
}


//UPDATE
function updateTasks(id, updates) {
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!existing) throw new Error('Task not found');

  const updated = {
    ...existing,
    ...updates,
  };

  const stmt = db.prepare(`
    UPDATE tasks
    SET title = ?, description = ?, status = ?, due_date = ?, priority=?, project_id = ?, estimated_minutes=?
    WHERE id = ?
  `);

  return stmt.run(
    updated.title,
    updated.description,
    updated.status,
    updated.due_date,
    updated.priority,
    updated.project_id,
    updated.estimated_minutes,
    id
  );
}

//DELETE

function deleteTask(id) {
  db.prepare(`DELETE FROM tasks WHERE id =?`).run(id);
}

module.exports={
  createTask,
  getAllTasks,
  getTasksByProject,
  getTasksByProjectId: getTasksByProject,
  updateTasks,
  deleteTask
};