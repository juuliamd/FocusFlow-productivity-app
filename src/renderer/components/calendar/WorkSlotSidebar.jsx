import { useEffect, useState } from 'react';
import WorkSlotForm from './WorkSlotForm';

export default function WorkSlotSidebar({ date }) {
  const [slots, setSlots] = useState([]);
  const [editingSlot, setEditingSlot] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const selectedDayStr = date.toISOString().slice(0, 10);

  const fetchSlots = async () => {
    const all = await window.api.invoke('get-work-slots');
    const filtered = all.filter(s => s.date === selectedDayStr || s.recurring === getWeekday(date));
    setSlots(filtered);
  };

  useEffect(() => {
    fetchSlots();
  }, [date]);

  const getWeekday = (d) => {
    return d.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  };

  return (
    <div className="w-72 bg-zinc-100 dark:bg-zinc-800 h-full p-4 flex flex-col border-l border-gray-300 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-2">Okna pracy</h2>

      <button
        onClick={() => {
          setShowForm(true);
          setEditingSlot(null);
        }}
        className="mb-3 bg-purple-600 hover:bg-purple-700 text-white py-1 px-2 rounded"
      >
        + Dodaj okno pracy
      </button>

      <ul className="flex flex-col gap-2 overflow-y-auto text-sm">
        {slots.map((slot) => (
          <li
            key={slot.id}
            className="bg-purple-100 dark:bg-purple-900 rounded p-2 cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-800"
            onClick={() => {
              setEditingSlot(slot);
              setShowForm(true);
            }}
          >
            {slot.start_time}–{slot.end_time}
            {slot.recurring && <span className="ml-1 italic text-xs text-gray-500">({slot.recurring})</span>}
          </li>
        ))}
      </ul>

      {showForm && (
        <div className="mt-4">
          <WorkSlotForm
            editingSlot={editingSlot}
            preselectedDate={editingSlot ? null : selectedDayStr}
            onSlotAdded={() => {
              fetchSlots();
              setShowForm(false);
              setEditingSlot(null);
            }}
            onDelete={() => {
              window.api.invoke('delete-work-slot', editingSlot.id).then(() => {
                fetchSlots();
                setShowForm(false);
                setEditingSlot(null);
              });
            }}
          />
        </div>
      )}
    </div>
  );
}
