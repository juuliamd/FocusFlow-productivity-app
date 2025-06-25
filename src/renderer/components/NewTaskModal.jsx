import React, {useEffect, useState} from 'react';

export default function NewTaskModal({ isOpen, onClose, onCreate, initialProjectId }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [form, setForm] = useState({
    due_date: '',
    status: '',
    priority: 'medium',
    project_id: null,
  });

  const[projects, setProjects]=useState([]);

  useEffect(()=>{
    if(!isOpen) return;
    window.api.getAllProjects().then(setProjects);
    setTitle('');
    setDescription('');
    setForm({ due_date: '', status: 'todo', priority: 'medium', project_id: initialProjectId || null });
  }, [isOpen, initialProjectId]);

  const handleSave = async () => {
    await window.api.createTask({
      title,
      description,
      due_date: form.due_date,
      priority: form.priority,
      status: form.status,
      project_id: form.project_id,
    });
    onCreate(); 
    onClose(); 
    setTitle('');
    setDescription('');
    setForm({ due_date: '', status: 'todo' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-[999]">
      <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-2xl shadow-xl w-full max-w-md space-y-4">
  
        <h2 className="text-2xl font-bold">Nowe zadanie</h2>
  
        {/* Tytuł */}
        <input
          type="text"
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 w-full p-2 rounded"
          placeholder="Tytuł"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
  
        {/* Opis */}
        <textarea
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 w-full p-2 rounded"
          placeholder="Opis"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
  
        {/* Wybór projektu */}
        <select
          value={form.project_id ?? ''}
          onChange={e => setForm({ ...form, project_id: Number(e.target.value) })}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 w-full rounded"
        >
          <option value="">– Brak projektu –</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
  
        {/* Termin */}
        <div className="space-y-1">
          <label className="block text-sm text-gray-600 dark:text-gray-300">Termin</label>
          <input
            type="date"
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 w-full rounded"
            value={form.due_date}
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
  
        {/* Przyciski */}
        <div className="flex justify-between pt-2">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
            onClick={handleSave}
          >
            Dodaj
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