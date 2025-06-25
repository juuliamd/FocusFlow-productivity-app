import React, {useState, useEffect} from 'react';
import TaskList from '../components/TaskList';
import NewTaskModal from '../components/NewTaskModal';





function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTasks = async () => {
    const fetched=await window.api.getAllTasks();
    setTasks(fetched);
  };

  useEffect(()=>{
    fetchTasks();
  },[]);

    return(
      <div className='p-4 dark:bg-gray-900 dark:text-white'>
        <button
          onClick={()=> setIsModalOpen(true)}
          className='bg-blue-500 text-white px-4 py-2 rounded mb-4'
          >
            Dodaj zadanie
        </button>
        
        <NewTaskModal
        isOpen={isModalOpen}
        onClose={()=> setIsModalOpen(false)}
        onCreate={async()=>{
         await fetchTasks();
        setIsModalOpen(false);}}
        />
        <h1 className='text-2xl font-bold mb-4'>Zadania</h1>
        <TaskList tasks={tasks} onTasksChange={fetchTasks}/>
      </div>
    );
  }
  export default Tasks;
  
  