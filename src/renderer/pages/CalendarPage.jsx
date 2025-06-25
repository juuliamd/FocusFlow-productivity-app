// src/renderer/pages/CalendarPage.jsx
import TopbarCalendarControls from '../components/calendar/TopbarCalendarControls';
import { CalendarSidebar } from "/components/calendar/CalendarSidebar.jsx";
import {useState, useEffect} from 'react';


import MonthView from '../components/calendar/MonthView';
import WeekView from '../components/calendar/WeekView';
import DayPlannerView from '../components/calendar/DayPlannerView';
import ProjectModal from '../components/ProjectModal';
import TaskModal from '../components/TaskModal';
import WorkSlotForm from '../components/calendar/WorkSlotForm';
import WorkSlotModal from '../components/calendar/WorkSlotModal';

//import { useState } from 'react';

export default function CalendarPage() {
  const [view, setView] = useState('week');
  const [events, setEvents] = useState([]);
  const [selectedTask, setSelectedTask]=useState(null);
  const [selectedProject, setSelectedProject]= useState(null)
  const [showWorkSlotModal, setShowWorkSlotModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [preselectedDate, setPreselectedDate] = useState(null);
  const [slots, setSlots]=useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [assignments, setAssignments]=useState([]);

  const handleDayClick = (isoDate) => {
    setSelectedDate(new Date(isoDate));
    setView('day');
  };
  


  useEffect(() => {
    window.api.invoke('get-calendar-events').then(setEvents);
  }, []);
  useEffect(()=>{
    window.api.invoke('get-task-assignments').then(setAssignments);
  },[]);
  useEffect(()=> {
    window.api.invoke('get-work-slots').then(setSlots);
  },[]);

  const renderView = () => {
    switch (view) {
      case 'month':
        return <MonthView 
                  events={events}
                  assignments={assignments}
                  onEventClick={(ev)=>{
                    if (ev.type === 'task'){
                      window.api.invoke('get-all-tasks').then(tasks => {
                        const task=tasks.find(t=> t.id ===ev.id);
                        setSelectedTask(task);
                      });
                    }else if (ev.type ==='project'){
                      window.api.invoke('get-all-projects').then(projects => {
                        const project = projects.find(p=> p.id === ev.id);
                        setSelectedProject(project);
                      });
                    }
                  }}
                  onDayClick={handleDayClick}
                       />;
      case 'week':
        return <WeekView 
                 assignments={assignments}
                 events={events}
                 slots={slots}
              
                  onDayClick={handleDayClick}
                  onEventClick={(ev)=>{
                    if(ev.type === 'task'){
                      window.api.invoke('get-all-tasks').then(tasks=>{
                        const task = tasks.find(t=>t.id === ev.task_id);
                        setSelectedTask(task);
                      });
                    }
                  } }
                />;
      case 'day':
        return <DayPlannerView date={selectedDate}
        onChangeDate={setSelectedDate}/>;
      default:
        return <WeekView />;
    }
  };

  return (
    <div className="flex flex-col h-full dark:bg-gray-900 dark:text-white">
      <TopbarCalendarControls view={view} setView={setView} />
      <div className='p-2'>
        <button
          onClick={()=> setShowWorkSlotModal(true)}
          className='bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded'
          >
            Dodaj okno pracy
          </button>
      </div>
      <div className="flex flex-grow overflow-hidden">
        <div className="flex-1 overflow-auto">{renderView()}</div>
      </div>
      

      {/* Modale wywoływane po kliknięciu w event w kalendarzu */}
      {selectedTask && (
        <TaskModal
          isOpen={true}
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={() => {
            setSelectedTask(null);
            window.api.invoke('get-calendar-events').then(setEvents);
          }}
          onDelete={() => {
            setSelectedTask(null);
            window.api.invoke('get-calendar-events').then(setEvents);
          }}
        />
      )}
  
      {selectedProject && (
        <ProjectModal
          isOpen={true}
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onUpdate={() => {
            setSelectedProject(null);
            window.api.invoke('get-calendar-events').then(setEvents);
          }}
          onDelete={() => {
            setSelectedProject(null);
            window.api.invoke('get-calendar-events').then(setEvents);
          }}
        />
      )}
      <WorkSlotModal
        isOpen={showWorkSlotModal || !!editingSlot || !!preselectedDate}
        editingSlot={editingSlot}
        preselectedDate={preselectedDate}
        onClose={() => {
          setShowWorkSlotModal(false);
          setEditingSlot(null);
          setPreselectedDate(null);
          }}
        onSlotAdded={() => {
          setShowWorkSlotModal(false);
          setEditingSlot(null);
          setPreselectedDate(null);
          window.api.invoke('get-work-slots').then(setSlots);

        
      }}
/>

    </div>
  );
  
}
