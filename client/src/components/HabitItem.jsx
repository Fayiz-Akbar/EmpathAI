import { useState } from 'react';
import { Trash2, Droplet, Moon, Heart, Coffee, Sun, CheckCircle } from 'lucide-react';
import { toggleHabit } from '../services/habitService';

const iconMap = {
  Droplet, Moon, Heart, Coffee, Sun, CheckCircle
};

const HabitItem = ({ habit, selectedDate, onDelete }) => {
  // Optimistic UI state
  const isInitiallyCompleted = habit.completedDates.includes(selectedDate);
  const [isCompleted, setIsCompleted] = useState(isInitiallyCompleted);
  const [isDeleting, setIsDeleting] = useState(false);

  // Use the mapped icon, fallback to CheckCircle
  const IconComponent = iconMap[habit.icon] || CheckCircle;

  const handleToggle = async () => {
    // 1. Optimistic Update (Instantly update UI)
    const newStatus = !isCompleted;
    setIsCompleted(newStatus);

    try {
      // 2. Fire API in background
      await toggleHabit(habit._id, selectedDate);
    } catch {
      // 3. Revert if API fails
      setIsCompleted(!newStatus);
      window.dispatchEvent(new CustomEvent('showNotification', { 
        detail: { message: 'Gagal memperbarui status habit', type: 'error' } 
      }));
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(habit._id);
    setIsDeleting(false);
  };

  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
      isCompleted 
        ? 'bg-[#8FA697]/10 border-[#8FA697]/30 dark:bg-[#8FA697]/15 dark:border-[#8FA697]/20' 
        : 'bg-white border-gray-100 hover:border-gray-200 dark:bg-[#2a2a3e] dark:border-gray-700 dark:hover:border-gray-600'
    }`}>
      
      <div className="flex items-center gap-4 flex-1 cursor-pointer select-none" onClick={handleToggle}>
        <div className={`p-2 rounded-lg ${isCompleted ? 'bg-[#5B7062]/10 dark:bg-[#8FA697]/10' : 'bg-gray-100 dark:bg-gray-800'}`}>
          <IconComponent size={18} className={isCompleted ? 'text-[#5B7062] dark:text-[#8FA697]' : 'text-gray-500 dark:text-gray-400'} />
        </div>
        
        <span className={`text-[15px] font-medium transition-colors ${
          isCompleted 
            ? 'text-gray-500 line-through dark:text-gray-400' 
            : 'text-gray-700 dark:text-gray-200'
        }`}>
          {habit.title}
        </span>
      </div>

      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors focus:outline-none"
        title="Hapus habit"
      >
        <Trash2 size={16} />
      </button>

    </div>
  );
};

export default HabitItem;
