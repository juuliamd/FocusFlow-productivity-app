import React, {useEffect, useState} from 'react';
import SectionTitle from '../components/UI/SectionTitle';
import Card from '../components/UI/Card';

export default function Settings() {
    const [darkMode, setDarkMode] = useState(false);
    const [calendarView, setCalendarView] = useState('week');
    const [showPomodoro, setShowPomodoro]=useState(true);


    useEffect(() => {
        const theme = localStorage.getItem('theme');
        const isCurrentlyDark = document.documentElement.classList.contains('dark');
        setDarkMode(theme=='dark' || (theme === null && isCurrentlyDark));

        setCalendarView(localStorage.getItem('defaultCalendarView') || 'week');
        setShowPomodoro(localStorage.getItem('showPomodoro') !== 'false');
      }, []);

        // Aktualizacje do localStorage
    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    useEffect(() => {
        localStorage.setItem('defaultCalendarView', calendarView);
    }, [calendarView]);

    useEffect(() => {
        localStorage.setItem('showPomodoro', showPomodoro);
    }, [showPomodoro]);

    const resetSettings = () => {
        localStorage.clear();
        window.location.reload();
    };

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-6 space-y-6">
        {/* Nagłówek strony */}
        
  
        {/* Karta z ustawieniami */}
        <div className="space-y-6">
          {/* Tryb ciemny */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="darkMode"
              checked={darkMode}
              onChange={e => setDarkMode(e.target.checked)}
              className="h-5 w-5 text-blue-600 rounded border-gray-300 dark:border-gray-600"
            />
            <label htmlFor="darkMode" className="text-sm">
              Tryb ciemny
            </label>
          </div>
  
          {/* Domyślny widok kalendarza */}
          <div>
            <label htmlFor="calendarView" className="block mb-1 text-sm">
              Domyślny widok kalendarza
            </label>
            <select
              id="calendarView"
              value={calendarView}
              onChange={e => setCalendarView(e.target.value)}
              className="input-field"
            >
              <option value="month">Miesięczny</option>
              <option value="week">Tygodniowy</option>
              <option value="day">Dzienny</option>
            </select>
          </div>
  
          {/* Pokazuj timer pomodoro */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showPomodoro"
              checked={showPomodoro}
              onChange={e => setShowPomodoro(e.target.checked)}
              className="h-5 w-5 text-blue-600 rounded border-gray-300 dark:border-gray-600"
            />
            <label htmlFor="showPomodoro" className="text-sm">
              Pokaż timer pomodoro w panelu bocznym
            </label>
          </div>
  
          {/* Reset danych */}
          <div>
            <button
              onClick={resetSettings}
              className="px-4 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-700 transition"
            >
              Wyczyść dane i zresetuj
            </button>
          </div>
        </div>
      </div>
    );
}
