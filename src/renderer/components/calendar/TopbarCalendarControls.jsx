import React from 'react';
import { scheduleTasks } from '../../../utils/scheduleTasks';
//import { getAllTasks } from '../../../main/databases/tasks';

export default function TopbarCalendarControls({ view, setView }) {
  const buttons = [
    { id: 'month', label: 'Miesiąc' },
    { id: 'week', label: 'Tydzień' },
    { id: 'day', label: 'Dzień' }
    
  ];
  const handleSchedule = async()=>{
    const tasks= await window.api.invoke('get-all-tasks');
    const projects = await window.api.invoke('get-all-projects');
    const slots = await window.api.invoke('get-work-slots');
    const plan = scheduleTasks(tasks,projects, slots);
    console.log('plan',plan);
    await window.api.invoke('save-task-assignments',plan);
  };

  const handleReschedule = async()=> {
    await window.api.invoke('clear-task-assignments');
    handleSchedule();
  }
  

  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Kalendarz</h2>

      <div className="flex gap-2">
        {buttons.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setView(id)}
            className={`px-3 py-1.5 rounded text-sm font-medium transition
              ${view === id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'}`}
          >
            {label}
          </button>
        ))}
        
        <button
          onClick={handleSchedule}
          className='bg-purple-400 hover:bg-purple-500 text-white px-3 py-1 rounded'>
          Zaplanuj
        </button>
        <button
          onClick={handleReschedule}
          className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded '>
          Zaplanuj ponownie
        </button>
      </div>
    </div>
  );
}
