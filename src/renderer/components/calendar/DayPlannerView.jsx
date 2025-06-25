// src/components/calendar/DayPlannerView.jsx
import React, {useEffect, useState} from 'react';
import WorkSlotModal from './WorkSlotModal';
import WorkSlotSidebar from './WorkSlotSidebar';
import { scheduleTasks } from '../../../utils/scheduleTasks';

export default function DayPlannerView({date, onChangeDate}) {
  const selectedDayStr = date.toISOString().slice(0, 10); // format 'YYYY-MM-DD'
  const [slots, setSlots] = useState([]);
  const [editingSlot, setEditingSlot]= useState(null);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const currentDate = new Date(date); //uzywanie danych z propsow
  const [assignments, setAssignments] = useState([]);
  const [tasks, setTasks] =useState([]);
  const [projects, setProjects] = useState([]);

  const plannedToday = assignments.filter(a=> a.date === selectedDayStr);

  useEffect(()=> {
    window.api.invoke('get-all-tasks').then(setTasks);
  },[]);

  const getTaskTitleById=(id, type)=>{
    if (type === 'task'){
      const task = Array.isArray(tasks) ? tasks.find(t=> t.id === id): null ;
      return task?.title || `Zadanie #${id}`;
    }
    if (type === 'project'){
      const project = Array.isArray(projects)? projects.find(p=> p.id === id) : null;
      return project?.name || `Projekt #${id}`;
    }
    return `#${id}`
    
  };

  useEffect(()=>{
    window.api.invoke('get-task-assignments').then(setAssignments);
  },[date]);

  useEffect(()=> {
    window.api.invoke('get-all-projects').then(setProjects);
  },[]);
  
  useEffect(() => {
    window.api.invoke('get-work-slots').then(all => {
      const filtered = all.filter(slot => slot.date === selectedDayStr || slot.recurring === getWeekday(date));
      setSlots(filtered);
    });
  }, [date]);

  const getWeekday = (d) => {
    return d.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();  // np. 'monday'
  };
 

  

  function timeToOffset(time) {
    const [h, m] = time.split(':').map(Number);
    return (h * 60 + m) * (80 / 60); // 80px = 1h
  }
  

  return (
    <div className="h-full flex overflow-hidden">
  
      {/* Lewa kolumna – siatka dnia */}
      <div className="flex-1 overflow-y-auto relative">
  
        {/* Nagłówek */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 dark:text-white text-sm font-semibold">
          <button onClick={() => onChangeDate(new Date())} className="text-blue-600 hover:underline">
            Dzisiaj
          </button>
          <div>
            {currentDate.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          <div className="space-x-2">
            <button onClick={() => onChangeDate(new Date(currentDate.setDate(currentDate.getDate() - 1)))}>◀</button>
            <button onClick={() => onChangeDate(new Date(currentDate.setDate(currentDate.getDate() + 1)))}>▶</button>
          </div>
        </div>
  
        {/* Warstwa slotów pracy czasowych */}
        <div className="relative h-[1920px]"> {/* 24h * 80px */}
          {slots.map(slot => {
            const top = timeToOffset(slot.start_time);
            const height = timeToOffset(slot.end_time) - top;
            return (
              <div
                key={slot.id}
                onClick={() => setEditingSlot(slot)}
                className="absolute left-16 right-4 bg-purple-500/30 rounded cursor-pointer"
                style={{ top: `${top}px`, height: `${height}px` }}
                title={`Okno pracy: ${slot.start_time}–${slot.end_time}`}
              />
            );
          })}
          {plannedToday
          .filter(a=> a && a.task_id && a.type && a.start_time)
          .map(a=>{
            const top = timeToOffset(a.start_time);
            const height = timeToOffset(a.end_time)-top;
            const bgColor = 
              a.type === 'project'
                ? 'bg-purple-500/30 border border-purple-700/30'
                : 'bg-blue-400/30 border border-blue-600/30';
            return(
              <div
              key={`planned-${a.type}-${a.task_id}-${a.start_time}`}
              className={`absolute left-16 right-4 ${bgColor} text-xs px-1 rounded`}
              style={{top: `${top +1}px`, height: `${height -1}px`}}
              >
              {getTaskTitleById(a.task_id, a.type)}
              </div>
            );
          })}

  
          {/* Siatka godzin */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {hours.map((h) => (
              <div key={h} className="h-20 px-4 flex items-start pt-2 text-sm relative">
                <span className="w-14 text-gray-400 dark:text-gray-500">
                  {String(h).padStart(2, '0')}:00
                </span>
                <div className="flex-1 border-l border-gray-300 dark:border-gray-600 pl-4">
          
                  <div className="text-gray-700 dark:text-gray-200 italic">

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Modal edycji slotu */}
        {editingSlot && (
          <WorkSlotModal
            isOpen={true}
            editingSlot={editingSlot}
            onClose={() => setEditingSlot(null)}
            onSlotAdded={() => {
              setEditingSlot(null);
              window.api.invoke('get-work-slots').then(setSlots);
            }}
          />
        )}

      </div>
  
      {/* Prawa kolumna – sidebar do zarządzania slotami */}
      <WorkSlotSidebar
        date={date}
        slots={slots}
        onSlotChange={() => {
          window.api.invoke('get-work-slots').then(setSlots);
          setEditingSlot(null);
        }}
      />

    </div>
  );
  
  
  
}