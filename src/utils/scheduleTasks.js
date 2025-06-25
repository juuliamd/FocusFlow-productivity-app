
export function scheduleTasks(tasks, projects, slots){
    const today = new Date().toISOString().slice(0,10);
    //filtrowanie zadań (aktywne i z estymacja czasu)
    const pendingItems = [
        ...tasks.filter(t=> t.status !== 'done' && t.estimated_minutes > 0).map(t=> ({
            ...t,
            type: 'task'
        })),
        ...projects.filter(p=>p.status !== 'done' && p.estimated_minutes> 0).map(p=>({
            ...p,
            type:'project'
        }))
    ];

    //sortowanie zadan wg. priorytet->deadline->czas
    pendingItems.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        if (a.due_date !== b.due_date) {
          return new Date(a.due_date) - new Date(b.due_date);
        }
        return a.estimated_minutes - b.estimated_minutes;
      });
        

    //sloty na wersje z minutami 

    const availableSlots = slots
    .filter(slot=> slot.date >= today)
    .map(slot => {
        const [h1, m1] = slot.start_time.split(':').map(Number);
        const [h2, m2] = slot.end_time.split(':').map(Number);
        const start = h1 * 60 + m1;
        const end = h2 * 60 + m2;
        return {
          ...slot,
          startMinutes: start,
          endMinutes: end,
          remaining: end - start,
        };
      });
    

    const assignments=[];
    
    //przypisywanie zadan do pierwszego pasującego slotu

    for (const item of pendingItems) {
        const deadlineTimestamp = item.due_date ? new Date(item.due_date).getTime() : Infinity;
    
        for (const slot of availableSlots) {
          const slotEndTimestamp = new Date(`${slot.date}T${slot.end_time}`).getTime();
    
          if (slot.remaining >= item.estimated_minutes && slotEndTimestamp <= deadlineTimestamp) {
            const start = slot.endMinutes - slot.remaining;
            const end = start + item.estimated_minutes;
    
            const startHour = String(Math.floor(start / 60)).padStart(2, '0');
            const startMin = String(start % 60).padStart(2, '0');
            const endHour = String(Math.floor(end / 60)).padStart(2, '0');
            const endMin = String(end % 60).padStart(2, '0');
    
            assignments.push({
              task_id: item.id,
              type: item.type, // 'task' lub 'project'
              date: slot.date,
              start_time: `${startHour}:${startMin}`,
              end_time: `${endHour}:${endMin}`
            });
    
            slot.remaining -= item.estimated_minutes;
            break;
          }
        }
      }
    
      return assignments;
}
