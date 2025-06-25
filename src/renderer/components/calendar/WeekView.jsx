// src/components/calendar/WeekView.jsx
import React from 'react';
import { useEffect, useState } from 'react';
import { startOfWeek, addDays, format } from 'date-fns';
import { pl } from 'date-fns/locale';

export default function WeekView({
  assignments=[], 
  events=[],
  slots=[],
  onEventClick,
  onDayClick}) {
 
  const today = new Date();
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 24 }, (_, i) => i);
  //const [slots, setSlots] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] =  useState([]);
  //onst [assignments, setAssignments]= useState([]);

  

  
  useEffect(()=> {
    window.api.invoke('get-all-tasks').then(setTasks);
    window.api.invoke('get-all-projects').then(setProjects);
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


  //useEffect(() => {
   // window.api.invoke('get-work-slots').then(setSlots);
  //}, []);
  
  const daysOfWeek = Array.from({ length: 7 }, (_, i) =>
    addDays(weekStart, i)
  );
  
  const filteredSlots = slots.filter(slot => {
    const slotDate = slot.date ? new Date(slot.date) : null;
    const slotWeekday = slot.recurring;
    
    return daysOfWeek.some(day => {
      const dayStr = day.toISOString().slice(0, 10);
      const dayName = day.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      
      return (slot.date && slotDate.toISOString().slice(0, 10) === dayStr) ||
             (slot.recurring && slotWeekday === dayName);
    });
  });
  

  return (
    <div className="grid grid-cols-[80px_1fr] h-full overflow-y-auto">
      {/* Kolumna godzin */}
      <div className="flex flex-col w-[80px] py-7 shrink-0">
        {hours.map(h => (
          <div key={h} className="h-20 px-2 text-xs text-gray-500 dark:text-gray-400 flex items-start justify-end pt-1 pr-1 border-t border-gray-200 dark:border-gray-700">
            {String(h).padStart(2, '0')}:00
          </div>
        ))}
      </div>
  
      {/* Siatka z kolumnami dni */}
      <div className="flex flex-1 relative">
        {days.map((day, dayIndex) => {
          const dayStr = day.toISOString().slice(0, 10);
          const weekdayName = day.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  
          return (
            <div key={dayStr} className="w-full  border-l border-gray-200 dark:border-gray-700 relative">
              {/* Nagłówek dnia */}
              <div className="text-center z-30 text-sm font-semibold py-1 bg-gray-100 dark:bg-gray-800 dark:text-white sticky top-0 ">
                {format(day, 'EEEE d', { locale: pl })}
              </div>
  
              {/* Linia godzinowa (tło) */}
              {hours.map(h => (
                <div
                  key={h}
                  className="h-20 border-t border-gray-100 dark:border-gray-700"
                />
              ))}
  
              {/* Sloty pracy */}
              {slots
                .filter(slot =>
                  (slot.date && slot.date === dayStr) ||
                  (slot.recurring && slot.recurring === weekdayName)
                )
                .map(slot => {
                  const [h1, m1] = slot.start_time.split(':').map(Number);
                  const [h2, m2] = slot.end_time.split(':').map(Number);
                  const top = (h1 * 60 + m1) * (80 / 60);
                  const height = ((h2 * 60 + m2) - (h1 * 60 + m1)) * (80 / 60);
  
                  return (
                    <div
                      key={`slot-${slot.id}`}
                      className="absolute left-1 right-1 bg-purple-500/30 rounded z-10"
                      style={{ top: `${top}px`, height: `${height}px` }}
                    />
                  );
                })}
  
              {/* Zadania / projekty */}
              {assignments
                .filter(a => a.date === dayStr)
                .map(a => {
                  const [h1, m1] = a.start_time.split(':').map(Number);
                  const [h2, m2] = a.end_time.split(':').map(Number);
                  const top = (h1 * 60 + m1) * (80 / 60);
                  const height = ((h2 * 60 + m2) - (h1 * 60 + m1)) * (80 / 60);
  
                  const bgColor =
                    a.type === 'project'
                      ? 'bg-purple-500/30 border border-purple-700'
                      : 'bg-blue-400/30 border border-blue-600';
  
                  return (
                    <div
                      key={`a-${a.type}-${a.task_id}-${a.start_time}`}
                      onClick={() => onEventClick?.(a)}
                      className={`absolute z-20 ${bgColor} text-xs px-1 rounded cursor-pointer left-1 right-1`}
                      style={{ top: `${top + 1}px`, height: `${height - 1}px` }}
                    >
                      {getTaskTitleById(a.task_id, a.type)}
                    </div>
                  );
                })}

                {/*deadline-y*/}
                
                <div className='flex flex-col gap-1 p-1'>
                  {events
                    .filter(ev => {
                      if (!ev.due_date) return false;
                      const parsed = new Date(ev.due_date);
                      return format(parsed, 'yyyy-MM-dd') === dayStr;
                    })
                    .map(({ id, title, type }) => (
                      <div  
                        key={`event-${id}-${type}`}
                        onClick={() => onEventClick?.({ id, title, type })}
                        className={`flex items-center gap-1 text-xs px-1 py-0.5 rounded cursor-pointer text-white 
                          ${type === 'task' ? 'bg-blue-600' : 'bg-red-600'}`}
                      >
                        <span>🕒</span>
                        <span className="truncate">{title}</span>
                      </div>
                    ))}
                </div>


            </div>
          );
        })}
      </div>
    </div>
  );
  
  
  
  
}