import Sidebar from './Sidebar';
import Topbar from './Topbar';
import React, { useEffect, useState } from 'react';
import RightPanel from './RightPanel';

export default function Layout({ children }) {

    const [showRightPanel, setShowRightPanel]=useState(true);

    const [isRightPanelOpen,setIsRightPanelOpen]=useState(()=>{
      const stored = localStorage.getItem('isRightPanelOpen');
      return stored ? JSON.parse(stored) : true;
    });

    useEffect(()=> {
      localStorage.setItem('isRightPanelOpen', JSON.stringify(isRightPanelOpen));
    }, [isRightPanelOpen]);

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Sidebar po lewej */}
      <Sidebar />

      {/* Główna zawartość + prawy panel */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onToggleRightPanel={() => setIsRightPanelOpen(prev => !prev)} 
          isRightPanelOpen={isRightPanelOpen}
          />

        {/*poziomy flex na main + right */}
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 p-6 overflow-y-auto">{children}</main>
          <RightPanel isOpen={isRightPanelOpen}/>
        </div>
      </div>
    </div>
  );
}

