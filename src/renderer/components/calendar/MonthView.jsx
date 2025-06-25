// src/components/calendar/MonthView.jsx
import React, { useState, useEffect } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format, isSameMonth, isSameDay } from 'date-fns';
import { pl } from 'date-fns/locale';

export default function MonthView({events = [], onEventClick, onDayClick, assignments=[]}) {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const [tasks, setTasks]= useState([]);
  const [projects, setProjects]=useState([]);

  const days = [];
  let current = startDate;

   useEffect(()=> {
    window.api.invoke('get-all-tasks').then(setTasks);
  },[]);

  useEffect(()=> {
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


  while (current <= endDate) {
    days.push(current);
    current = addDays(current, 1);
  }

  return (
    <div className="grid grid-cols-7 gap-px bg-gray-300 dark:bg-gray-700">
      {days.map((day, i) => {
        const dayStr = format(day, 'yyyy-MM-dd');
        const dayEvents = events.filter(ev =>{
          if (!ev.due_date) return false;
          const parsed = new Date(ev.due_date);
          return !isNaN(parsed) && format(parsed, 'yyyy-MM-dd')===dayStr;
        });
        
        const dayAssignments= assignments?.filter(a=> a.date ===dayStr) || [];
  
        return (
          <div
            key={i}
            onClick={()=> onDayClick?.(format(day, 'yyyy-MM-dd'))}
            className={`min-h-[100px] p-2 bg-white dark:bg-gray-800 text-sm cursor-pointer
              ${!isSameMonth(day, today) ? 'text-gray-400' : 'text-gray-900 dark:text-white'}
              ${isSameDay(day, today) ? 'border border-blue-500' : ''}`}
          >
            <div className="font-semibold mb-1">{format(day, 'd', { locale: pl })}</div>
  
            {/* Lista eventów tego dnia */}
            {dayEvents.map(ev => (
          <div
            key={ev.id + ev.type}
            onClick={() => onEventClick?.(ev)}
            className={`text-xs rounded px-1 py-0.5 mb-0.5 text-white cursor-pointer
              ${ev.type === 'task' ? 'bg-blue-600' : 'bg-red-600'}`}
          >
            {ev.title}
          </div>
        ))}

        {/* Lista Przypisanych zadań z planu*/}
        {dayAssignments.map(a=> {
          const bgColor = a.type === 'project'? 'bg-purple-500' : 'bg-blue-400' ;
         return(
          <div
            key={`a-${a.type}-${a.task_id}-${a.start_time}`}
            className={`text-xs rounded px-1 py-0.5 mb-0.5 ${bgColor}  text-white cursor-default`}
          >
             {getTaskTitleById(a.task_id, a.type)}
          </div>
        )})}


          </div>
        );
      })}
    </div>
  );
  
}