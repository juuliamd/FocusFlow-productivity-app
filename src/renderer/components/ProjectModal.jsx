import React, { useEffect, useState } from 'react';
import NewTaskModal from './NewTaskModal';
import TaskModal from './TaskModal';


export default function ProjectModal({
  project,
  isOpen,
  onClose,
  onUpdate,
  onDelete
}) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [estimatedMinutes, setEstimatedMinutes] = useState('');
  const [form, setForm] = useState({
    due_date: project.due_date || '',
    priority: project.priority || 'medium',
    status: project.status || 'todo',
  });
  const [tasks, setTasks]=useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showNewTask, setShowNewTask]=useState(false);
  const [notes, setNotes] = useState(project.notes || '');

  useEffect(() => {
    if (!isOpen) return;

    // 1) załaduj formę projektu
    setName(project.name);
    setDescription(project.description);
    setNotes(project.notes || '');
    setEstimatedMinutes(project.estimated_minutes || '');
    setForm({
      due_date: project.due_date || '',
      priority: project.priority || 'medium',
      status: project.status || 'todo',
    });

    // 2) pobierz zadania z tego projektu
    window.api.getTasksByProjectId(project.id)
      .then(fetched => setTasks(fetched))
      .catch(console.error);
  }, [isOpen, project.id]);

   async function fetchProjectTasks() {
    const list = await window.api.getTasksByProjectId(project.id);
    setTasks(list);
  }

  const handleSave = async () => {
    await window.api.updateProject({
      id: project.id,
      name,
      description,
      due_date: form.due_date,
      priority: form.priority,
      status: form.status,
      estimated_minutes: estimatedMinutes || null,
      notes
    });
    onUpdate();
  };

  const handleDelete = async () => {
    if (window.confirm('Czy na pewno chcesz usunąć ten projekt?')) {
      await window.api.deleteProject(project.id);
      onDelete();
    }
  };

  if (!isOpen) return null;

  const getPriorityColor = (priority)=>{
    switch(priority){
      case 'low':return 'bg-green-200';
      case 'medium':return 'bg-yellow-200';
      case 'high':return 'bg-red-200';
      default: return 'bg-white';
  }};

  return (
    <>
      {/* GŁÓWNY MODAL PROJEKTU */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-5xl bg-white dark:bg-gray-900 dark:text-white rounded-3xl shadow-2xl py-4 px-5 z-50">
  
        {/* Nagłówek */}
        <header className="py-3 border-b-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex-shrink-0" />
            <h1 className="text-3xl font-bold">
              <input
                className="w-full rounded bg-transparent border-none focus:outline-none"
                type="text"
                placeholder="Nazwa projektu"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </h1>
          </div>
        </header>
  
        {/* Treść layoutu w 3 kolumnach */}
        <div className="grid grid-cols-[3fr_2fr_1fr] gap-3 py-2">
  
          {/* Lewa kolumna: opis i notatki */}
          <div className="flex flex-col flex-grow">
            <textarea
              className="bg-gray-50 dark:bg-gray-800 dark:text-white p-2 w-full h-1/3 rounded-xl mb-2 resize-none border border-gray-300 dark:border-gray-600"
              placeholder="Opis projektu"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            <textarea
              className="bg-gray-50 dark:bg-gray-800 dark:text-white p-2 w-full h-2/3 rounded-xl resize-none border border-gray-300 dark:border-gray-600"
              placeholder="Notatki do projektu"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>
  
          {/* Środkowa kolumna: lista zadań */}
          <div className="bg-gray-50 dark:bg-gray-800 w-full p-2 flex flex-col rounded-xl overflow-y-auto max-h-[60vh] border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-l font-semibold">Zadania projektu</h3>
              <button
                onClick={() => setShowNewTask(true)}
                className="bg-green-500 text-white px-2 hover:bg-green-600 text-sm py-1 rounded-lg transition"
              >
                Dodaj nowe
              </button>
            </div>
  
            {tasks.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-300">Brak zadań.</p>
            ) : (
              <ul className="space-y-2">
                {tasks.map(task => (
                  <li key={task.id} className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 rounded shadow-sm">
                    <span>
                      <strong className="text-sm font-semibold">{task.title}</strong>
                      <em className="text-sm text-gray-500 dark:text-gray-300 ml-2">[{task.status}]</em>
                    </span>
                    <div className="space-x-2">
                      <button
                        onClick={() => setSelectedTask(task)}
                        className="text-blue-500 text-xs hover:underline"
                      >
                        Edytuj
                      </button>
                      <button
                        onClick={async () => {
                          await window.api.deleteTask(task.id);
                          setTasks(tasks.filter(t => t.id !== task.id));
                        }}
                        className="text-red-500 text-xs hover:underline"
                      >
                        Usuń
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
  
          {/* Prawa kolumna: właściwości projektu */}
          <div className="flex flex-col border-l-2 border-gray-200 dark:border-gray-700 pl-2 space-y-4">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Termin</label>
              <input
                type="date"
                className="bg-gray-100 dark:bg-gray-700 dark:text-white text-sm p-2 w-full rounded-lg border border-gray-300 dark:border-gray-600"
                value={form.due_date?.slice(0, 10) || ''}
                onChange={e => setForm({ ...form, due_date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Priorytet</label>
              <select
                className={`bg-gray-100 dark:bg-gray-700 dark:text-white text-sm p-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 ${getPriorityColor(form.priority)}`}
                value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value })}
              >
                <option value="low">Niski</option>
                <option value="medium">Średni</option>
                <option value="high">Wysoki</option>
                <option value="">Wybierz priorytet</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Status</label>
              <select
                className="bg-gray-100 dark:bg-gray-700 dark:text-white text-sm p-2 w-full rounded-lg border border-gray-300 dark:border-gray-600"
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
              >
                <option value="todo">Nie rozpoczęte</option>
                <option value="in_progress">W trakcie</option>
                <option value="done">Zakończone</option>
              </select>
            </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Szacowany czas projektu (minuty)</label>
                <input
                  type="number"
                  min="1"
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                  className="w-full border rounded px-2 py-1 text-black dark:text-white dark:bg-zinc-800"
                  placeholder="np. 240"
                />
              </div>

  
            {/* Metadata */}
            <div className="mt-auto text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div>Utworzono: {new Date(project.created_at).toLocaleString()}</div>
              <div>Ostatnia zmiana: {new Date(project.updated_at).toLocaleString()}</div>
            </div>
          </div>
        </div>
  
        {/* Stopka z przyciskami */}
        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
            Zapisz
          </button>
          <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
            Usuń
          </button>
          <button onClick={onClose} className="bg-gray-300 dark:bg-gray-600 dark:text-white text-gray-800 px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition">
            Anuluj
          </button>
        </div>
  
      </div>
  
      {/* MODALE: dodawanie i edycja zadań */}
      {showNewTask && (
        <NewTaskModal
          isOpen={showNewTask}
          initialProjectId={project.id}
          onClose={() => setShowNewTask(false)}
          onCreate={() => {
            setShowNewTask(false);
            fetchProjectTasks();
          }}
        />
      )}
  
      {selectedTask && (
        <TaskModal
          isOpen={!!selectedTask}
          task={selectedTask}
          onClose={() => {
            setSelectedTask(null);
            fetchProjectTasks();
          }}
          onUpdate={() => {
            fetchProjectTasks();
          }}
          onDelete={() => {
            setSelectedTask(null);
            setTasks(tasks.filter(t => t.id !== selectedTask.id));
          }}
        />
      )}
    </>
  );
  
}
