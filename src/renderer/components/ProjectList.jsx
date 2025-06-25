import React, { useEffect, useState } from 'react';
import ProjectModal from './ProjectModal';

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchProjects = async () => {
    const all = await window.api.getAllProjects();
    setProjects(all);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleInlineChange = async (id, field, value) => {
    // znajdź projekt i przygotuj pełny obiekt do update'u
    const proj = projects.find(p => p.id === id);
    await window.api.updateProject({
      ...proj,
      [field]: value,
    });
    await fetchProjects();
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Lista projektów</h2>
  
      <ul className="space-y-4">
        {projects.length > 0 ? (
          projects.map(p => (
            <li
              key={p.id}
              onClick={() => setSelectedProject(p)}
              className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-sm cursor-pointer hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">{p.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{p.description}</p>
                </div>
  
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleInlineChange(
                      p.id,
                      'status',
                      p.status === 'todo'
                        ? 'in_progress'
                        : p.status === 'in_progress'
                        ? 'done'
                        : 'todo'
                    );
                  }}
                  className="text-sm text-blue-500 underline hover:text-blue-600"
                >
                  Zmień status
                </button>
              </div>
  
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-700 dark:text-gray-200">
                {p.due_date && (
                  <div>Termin: {new Date(p.due_date).toLocaleDateString()}</div>
                )}
  
                {/* Status */}
                <div>
                  Status:{' '}
                  <select
                    value={p.status}
                    onChange={e => handleInlineChange(p.id, 'status', e.target.value)}
                    onClick={e => e.stopPropagation()}
                    className="border border-gray-300 dark:border-gray-600 rounded p-1 bg-white dark:bg-gray-700"
                  >
                    <option value="todo">Nie rozpoczęte</option>
                    <option value="in_progress">W trakcie</option>
                    <option value="done">Zakończone</option>
                  </select>
                </div>
  
                {/* Priorytet */}
                <div>
                  Priorytet:{' '}
                  <select
                    value={p.priority}
                    onChange={e => handleInlineChange(p.id, 'priority', e.target.value)}
                    onClick={e => e.stopPropagation()}
                    className="border border-gray-300 dark:border-gray-600 rounded p-1 bg-white dark:bg-gray-700"
                  >
                    <option value="low">Niski</option>
                    <option value="medium">Średni</option>
                    <option value="high">Wysoki</option>
                  </select>
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="text-gray-500 dark:text-gray-300">Brak projektów</li>
        )}
      </ul>
  
      {selectedProject && (
        <ProjectModal
          isOpen={!!selectedProject}
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onUpdate={() => {
            fetchProjects();
            setSelectedProject(null);
          }}
          onDelete={() => {
            fetchProjects();
            setSelectedProject(null);
          }}
        />
      )}
    </div>
  );
  
}
