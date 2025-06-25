import React, { useEffect, useState } from 'react';
import TaskModal from './TaskModal';

export default function TaskList({tasks, onTasksChange}) {
  //const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  //const [newTask, setNewTask] = useState({ title: '', description: '', status:'todo', due_date:'' });
  const [projects, setProjects]=useState([]);


  const fetchTasks = async () => {
    const result = await window.api.getAllTasks();
    await onTasksChange();
  };

  useEffect(() => {
    fetchTasks();
    window.api.getAllProjects().then(setProjects);
  }, []);


  const handleStatusChange = async(taskId, newStatus)=>{
    await window.api.updateTasks(taskId,{status: newStatus});
    onTasksChange();
  }

  const handlePriorityChange = async (taskId, newPriority) => {
    await window.api.updateTasks(taskId, { priority: newPriority });
    onTasksChange();
  };

  return (
    <div className="mt-8">
      <ul className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map((t) => (
            <li
              key={t.id}
              className="p-4 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 shadow-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              onClick={() => setSelectedTask(t)}
            >
              {/* Tytuł zadania */}
              <h3 className="text-lg font-bold">{t.title}</h3>
  
              {/* Opis (jeśli istnieje) */}
              {t.description && (
                <p className="text-gray-600 dark:text-gray-300">{t.description}</p>
              )}
  
              {/* Projekt */}
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Projekt:{' '}
                {t.project_id
                  ? projects.find((p) => p.id === t.project_id)?.name || `ID: ${t.project_id}`
                  : 'Brak przypisanego projektu'}
              </p>
  
              {/* Termin */}
              {t.due_date && !isNaN(new Date(t.due_date)) && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Termin: {new Date(t.due_date).toLocaleDateString()}
                </p>
              )}
  
              {/* Status + Priorytet */}
              <div className="flex items-center gap-2 mt-2">
                <label className="text-sm text-gray-500 dark:text-gray-300">Status:</label>
                <select
                  value={t.status || ''}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleStatusChange(t.id, e.target.value)}
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded p-1 bg-white dark:bg-gray-700 dark:text-white"
                >
                  <option value="todo">Nie rozpoczęte</option>
                  <option value="in_progress">W trakcie</option>
                  <option value="done">Zakończono</option>
                </select>
  
                <label className="text-sm text-gray-500 dark:text-gray-300">Priorytet:</label>
                <select
                  value={t.priority || ''}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handlePriorityChange(t.id, e.target.value)}
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded p-1 ml-2 bg-white dark:bg-gray-700 dark:text-white"
                >
                  <option value="low">Niska</option>
                  <option value="medium">Średnia</option>
                  <option value="high">Wysoka</option>
                </select>
              </div>
            </li>
          ))
        ) : (
          <li className="text-gray-500 dark:text-gray-300">Brak zadań</li>
        )}
      </ul>
  
      {/* Task Modal */}
      {selectedTask && (
        <TaskModal
          isOpen={!!selectedTask}
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={() => {
            onTasksChange();
            fetchTasks();
            setSelectedTask(null);
          }}
          onDelete={() => {
            fetchTasks();
            onTasksChange();
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
  
}
