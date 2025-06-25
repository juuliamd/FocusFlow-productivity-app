import {useEffect, useState} from 'react';
import {Moon, Sun} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import {PanelRightOpen, PanelRightClose} from 'lucide-react';
import {Settings} from 'lucide-react';
import { useNavigate  } from 'react-router-dom';


export default function Topbar({onToggleRightPanel, isRightPanelOpen}) {
  console.log('Topbar props:', onToggleRightPanel);

  const [isDark, setIsDark]=useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      document.documentElement.classList.add("dark");
      setIsDark(true);
  }
},[])

  const toggleDarkMode = () => {
    const html = document.documentElement;
    const dark = html.classList.toggle("dark");

    setIsDark(dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  };

  const navigate = useNavigate();

  const routeTitles = {
    "/": "Dashboard",
    "/Projects": "Projekty",
    "/Tasks": "Zadania",
    "/Stats": "Statystyki",
    "/Calendar": "Kalendarz"
  };
  const pageTitle = routeTitles[location.pathname] || 'FocusFlow';
  
  return (
    <div className="h-16 bg-white dark:bg-gray-900 border-b-thick border-gray-100 dark:border-gray-700 flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{pageTitle}</h1>
  
      <div className='flex items-center space-x-3'>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded border border-gray-400 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {isDark ? <Sun size={18}/>:<Moon size={18}/>}
        
        </button>

        {/*Ustawienia button*/}
        <button
          onClick={()=> navigate('/ustawienia')}
          className='p-2 rounded border border-gray-400 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700'
          title="Ustawienia"
          >
            <Settings size={18}/>
          </button>

        <button
          onClick={onToggleRightPanel}
          className="p-2 rounded border border-gray-400 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Pokaż/ukryj panel"
        >
         {isRightPanelOpen ? <PanelRightClose size={20}/> : <PanelRightOpen size={20}/>}
        </button>
      </div>
    </div>
  );
  
  }
  