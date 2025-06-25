import React, { useState, useEffect } from 'react';

export default function TaskModal({ isOpen, task, onClose, onUpdate, onDelete }) {
  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [estimatedMinutes, setEstimatedMinutes] = useState('');
  const [form, setForm] = useState({
    due_date: task.due_date || '',
    status: task.status || 'todo',
    project_id: task.project_id || null,
  });

  const [projects, setProjects] = useState([]);

  useEffect(()=> {
    if(!isOpen || !task) return;

    setTitle(task.title || ''),
    setDescription(task.description || '');
    setEstimatedMinutes(task.estimated_minutes || '');
    setForm({
      due_date:   task.due_date   || '',
      status:     task.status     || 'todo',
      priority:   task.priority   || 'medium',
      project_id: task.project_id ?? '',
    });
    
    window.api.getAllProjects().then(setProjects);
    console.log(task);
    console.log(task.estimated_minutes);
  }, [isOpen, task]);
  

  const handleSave = async () => {
    await window.api.updateTasks(task.id, { 
      title, 
      description,
      status: form.status,
      due_date: form.due_date,
      project_id: form.project_id || null,
      priority: form.priority,
      estimated_minutes: estimatedMinutes || null
     });
    onUpdate();
  };

  const handleDelete = async () => {
    await window.api.deleteTask(task.id);
    onDelete();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-2xl shadow-xl w-full max-w-lg space-y-4">
        <h2 className="text-2xl font-bold">Edytuj zadanie</h2>
  
        {/* Tytuł */}
        <input
          type="text"
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 w-full p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
  
        {/* Opis */}
        <textarea
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 w-full p-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
  
        {/* Wybór projektu */}
        <select
          value={form.project_id ?? ''}
          onChange={(e) => setForm({ ...form, project_id: Number(e.target.value) })}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 w-full rounded"
        >
          <option value="">– Brak projektu –</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
  
        {/* Termin */}
        <div className="space-y-1">
          <label className="block text-sm text-gray-600 dark:text-gray-300">Termin</label>
          <input
            type="date"
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 w-full rounded"
            value={form.due_date?.slice(0, 10) || ''}
            onChange={(e) => setForm({ ...form, due_date: e.target.value })}
          />
        </div>
  
        {/* Status */}
        <div className="space-y-1">
          <label className="block text-sm text-gray-600 dark:text-gray-300">Status</label>
          <select
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 w-full rounded"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="todo">Nie rozpoczęte</option>
            <option value="in_progress">W trakcie</option>
            <option value="done">Zakończono</option>
          </select>
        </div>
  
        {/* Priorytet */}
        <div className="space-y-1">
          <label className="block text-sm text-gray-600 dark:text-gray-300">Priorytet</label>
          <select
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 w-full rounded"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          >
            <option value="low">Niska</option>
            <option value="medium">Średnia</option>
            <option value="high">Wysoka</option>
          </select>
        </div>

        {/*ETA */}
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1'>Szacowany czas (minuty)</label>
          <input
          type='number'
          min='1'
          value={estimatedMinutes}
          onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
          className='w-full border rounded px-2 py-1 text-block dark:text-white dark:bg-zinc-800'
          placeholder='mp. 60'
          />
        </div>
  
        {/* Przyciski */}
        <div className="flex justify-between pt-2">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
            onClick={handleSave}
          >
            Zapisz
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
            onClick={handleDelete}
          >
            Usuń
          </button>
          <button
            className="text-gray-600 dark:text-gray-300 hover:underline"
            onClick={onClose}
          >
            Anuluj
          </button>
        </div>
      </div>
    </div>
  );
  
}
