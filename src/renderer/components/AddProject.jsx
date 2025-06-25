import React, { useState } from 'react';

export default function AddProject({ onProjectAdded }) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('todo');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    await window.api.createProject({
      name,
      description,
      due_date: dueDate,
      priority,
      status,
      notes
    });

    onProjectAdded();

    // Reset stanu
    setName('');
    setDescription('');
    setDueDate('');
    setPriority('medium');
    setStatus('todo');
    setNotes('');
    setShowModal(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'bg-green-200';
      case 'medium': return 'bg-yellow-200';
      case 'high': return 'bg-red-200';
      default: return 'bg-white';
    }
  };

  return (
    <div>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        onClick={() => setShowModal(true)}
      >
        Dodaj projekt
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
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

            {/* Layout w 3 kolumnach */}
            <div className="grid grid-cols-[3fr_2fr_1fr] gap-3 py-2">
              {/* Opis i notatki */}
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
                  onChange={e=> setNotes(e.target.value)}
                  
                />
              </div>

              {/* Środkowa kolumna pusta (bo brak zadań) */}
              <div className="bg-gray-50 dark:bg-gray-800 w-full p-2 flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 justify-center items-center text-gray-400 dark:text-gray-500 text-sm">
                Zadania zostaną dodane po utworzeniu projektu
              </div>

              {/* Właściwości projektu */}
              <div className="flex flex-col border-l-2 border-gray-200 dark:border-gray-700 pl-2 space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Termin</label>
                  <input
                    type="date"
                    className="bg-gray-100 dark:bg-gray-700 dark:text-white text-sm p-2 w-full rounded-lg border border-gray-300 dark:border-gray-600"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Priorytet</label>
                  <select
                    className={`bg-gray-100 dark:bg-gray-700 dark:text-white text-sm p-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 ${getPriorityColor(priority)}`}
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                  >
                    <option value="low">Niski</option>
                    <option value="medium">Średni</option>
                    <option value="high">Wysoki</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Status</label>
                  <select
                    className="bg-gray-100 dark:bg-gray-700 dark:text-white text-sm p-2 w-full rounded-lg border border-gray-300 dark:border-gray-600"
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                  >
                    <option value="todo">Nie rozpoczęte</option>
                    <option value="in_progress">W trakcie</option>
                    <option value="done">Zakończone</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Stopka z przyciskami */}
            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="submit"
                onClick={handleSubmit}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Zapisz
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 dark:bg-gray-600 dark:text-white text-gray-800 px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition"
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
