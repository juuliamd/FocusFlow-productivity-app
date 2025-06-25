import React, { useState } from 'react';
import AddProject from '../components/AddProject.jsx';
import ProjectList from '../components/ProjectList.jsx';
import ProjectModal from '../components/ProjectModal.jsx';

export default function App() {
  const [reload, setReload] = useState(false);
  const [selectedProject, setSelectedProject]=useState(null);

  const triggerReload = () => {
    setReload(!reload);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 dark:text-white px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">FocusFlow – Projekty</h1>
      <AddProject onProjectAdded={triggerReload} />
      <ProjectList key={reload} onSelectProject={setSelectedProject}/>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          isOpen={!selectedProject}
          onClose={() => setSelectedProject(null)}
          onUpdate={triggerReload}
          onDelete={() => {
            setSelectedProject(null);
            triggerReload();
          }}
          />
      )}
    
    
    </div>
      
  );
}
