import { useEffect, useState } from 'react';

export default function WorkSlotForm({ 
  onSlotAdded,
  onDelete,
  editingSlot = null,
  preselectedDate = null
}) {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [recurring, setRecurring] = useState('');

  useEffect(() => {
    if (editingSlot) {
      setDate(editingSlot.date || '');
      setStartTime(editingSlot.start_time || '');
      setEndTime(editingSlot.end_time || '');
      setRecurring(editingSlot.recurring || '');
    } else if (preselectedDate) {
      setDate(preselectedDate);
    }
  }, [editingSlot, preselectedDate]);

  const handleSave = async () => {
    if (!startTime || !endTime || (!date && !recurring)) {
      alert('Uzupełnij wszystkie wymagane pola.');
      return;
    }

    const data = {
      date: recurring ? null : date,
      start_time: startTime,
      end_time: endTime,
      recurring: recurring || null
    };

    try {
      if (editingSlot) {
        await window.api.invoke('update-work-slot', { ...data, id: editingSlot.id });
      } else {
        await window.api.invoke('add-work-slot', data);
      }
      onSlotAdded?.();
    } catch (err) {
      console.error('Błąd zapisu:', err);
      alert('Wystąpił błąd podczas zapisu slotu.');
    }
  };

  return (
    <div className="flex flex-col gap-3 bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl shadow max-w-md">
      <h2 className="text-lg font-semibold">{editingSlot ? 'Edytuj okno pracy' : 'Dodaj okno pracy'}</h2>

      <label className="text-sm">Data (dla jednorazowych slotów)</label>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} className="p-2 rounded" disabled={!!recurring} />

      <label className="text-sm">Czas</label>
      <div className="flex gap-2">
        <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="p-2 rounded w-full" />
        <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="p-2 rounded w-full" />
      </div>

      <label className="text-sm">Powtarzalność</label>
      <select value={recurring} onChange={(e) => setRecurring(e.target.value)} className="p-2 rounded">
        <option value="">Nie powtarzaj</option>
        <option value="monday">Poniedziałki</option>
        <option value="tuesday">Wtorki</option>
        <option value="wednesday">Środy</option>
        <option value="thursday">Czwartki</option>
        <option value="friday">Piątki</option>
        <option value="saturday">Soboty</option>
        <option value="sunday">Niedziele</option>
      </select>

      <div className="flex justify-between items-center mt-2">
        {editingSlot && (
          <button
            onClick={() => onDelete?.()}
            className="text-red-600 hover:underline text-sm"
          >
            Usuń
          </button>
        )}
        <button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded ml-auto">
          Zapisz
        </button>
      </div>
    </div>
  );
}
