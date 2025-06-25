import WorkSlotForm from './WorkSlotForm';

export default function WorkSlotModal({ 
    isOpen, 
    onClose, 
    onSlotAdded,
    editingSlot=null,
    preselectedDate=null
     }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-2xl shadow-xl w-full max-w-md">
        <WorkSlotForm
          editingSlot={editingSlot}
          preselectedDate={preselectedDate}
          onSlotAdded={onSlotAdded}
          onDelete={() => {
            if (editingSlot) {
              window.api.invoke('delete-work-slot', editingSlot.id).then(() => {
                onSlotAdded?.();
                onClose();
              });
            }
          }}
        />

        <div className="text-right mt-4">
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-300 hover:underline"
          >
            Anuluj
          </button>
        </div>
      </div>
    </div>
  );
}
