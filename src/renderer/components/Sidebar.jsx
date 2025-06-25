import { Link, useLocation } from "react-router-dom";
import {cn} from '../utils.js'
import React from 'react'
import UserAvatar from "./UserAvatar.jsx";
import { LayoutDashboard, Calendar, ChartBarBig, ClipboardList, Folder, ChevronRight  } from "lucide-react";

function Sidebar() {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Zadania", path: "/zadania", icon: ClipboardList },
    { name: "Projekty", path: "/projekty", icon: Folder },
    { name: "Statystyki", path: "/statystyki",icon: ChartBarBig },
    { name: "Kalendarz", path: "/kalendarz", icon: Calendar},
    
  ];

  return (
    <div className="w-40 h-full bg-white border-r-thick border-gray-300 dark:bg-slate-900 dark:border-r-thick dark:border-gray-500 text-gray-900 dark:text-white p-3 flex flex-col">
      <h2 className="text-2xl font-bold mb-4">FocusFlow</h2>
      <UserAvatar className='p-3'/>
      <nav className="space-y-1 flex-1 py-4">
        {navItems.map((item) =>{
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "relative flex items-center gap-3 py-2 px-4 text-sm rounded-lg transition-all",
              isActive
              ? "bg-gray-200 dark:bg-gray-800 font-semibold text-black dark:text-white pl-6 translate-x-1"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              
            )}
          >
            {/* Strzałka po lewej */}
            {isActive && (
                <ChevronRight
                size={16}
                className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-500"
              />
              )}

              <Icon size={18} />
              <span>{item.name}</span>
            </Link>
        );
})}
      </nav>
    </div>
  );
  
}

export default Sidebar;
