const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  invoke: (...args)=>ipcRenderer.invoke(...args),
  // projekty
  createProject: (project) => ipcRenderer.invoke('create-project', project),
  getAllProjects: () => ipcRenderer.invoke('get-all-projects'),
  updateProject: (project) => ipcRenderer.invoke('update-project', project),
  deleteProject: (id) => ipcRenderer.invoke('delete-project', id),

  // zadania 
  createTask: (task) => ipcRenderer.invoke('create-task', task),
  getAllTasks: () => ipcRenderer.invoke('get-all-tasks'),
  updateTasks: (id, updates) => ipcRenderer.invoke('update-tasks', id, updates),
  deleteTask: (id) => ipcRenderer.invoke('delete-task', id),
  getTasksByProjectId: (projectId) => ipcRenderer.invoke('get-tasks-by-project-id', projectId),
});
