
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import './calendar-dark.css';
import React, {useState} from 'react';




export default function RightPanel({isOpen}) {

    const [date,setDate] =useState(new Date());

    return (
      <aside
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'w-[280px]' : 'w-[12px]'
        } bg-gray-100 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4`}
      >
        {isOpen && (
          <>
            {/* Kalendarz */}
            <div className="mb-6">
              <h2 className="font-semibold mb-2 text-sm">📅 Kalendarz</h2>
              <Calendar
                onChange={setDate}
                value={date}
                className="scale-[0.85] origin-top rounded-lg w-full"
                locale="pl-PL"
              />
            </div>
    
            {/* Lista zadań */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-sm">✅ Lista zadań</h3>
              <ul className="text-sm space-y-1">
                <li className="bg-white dark:bg-gray-700 p-2 rounded">
                  🟢 Prezentacja na spotkanie
                </li>
                <li className="bg-white dark:bg-gray-700 p-2 rounded">
                  🔵 Przygotuj notatki
                </li>
              </ul>
            </div>
    
            {/* Timer */}
            <div>
              <h3 className="font-semibold mb-2 text-sm">⏱️ Sesja pracy</h3>
              <div className="bg-white dark:bg-gray-700 rounded p-4 text-center text-xl font-bold">
                00:00
              </div>
              <div className="flex justify-center gap-2 mt-2">
                <button className="px-3 py-1 bg-green-500 text-white text-sm rounded">
                  Start
                </button>
                <button className="px-3 py-1 bg-gray-300 text-sm rounded">
                  Reset
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    );
    
  }
  