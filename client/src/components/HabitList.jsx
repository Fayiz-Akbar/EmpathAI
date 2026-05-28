import { useState } from 'react';
import HabitItem from './HabitItem';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { createHabit, deleteHabit } from '../services/habitService';

const AVAILABLE_ICONS = [
  { name: 'Droplet', label: 'Water' },
  { name: 'Moon', label: 'Sleep' },
  { name: 'Heart', label: 'Health' },
  { name: 'Coffee', label: 'Morning' },
  { name: 'Sun', label: 'Day' },
  { name: 'Target', label: 'Task' }
];

const HabitList = ({ habits, setHabits, selectedDate }) => {
  const [newTitle, setNewTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await createHabit({ title: newTitle });
      setHabits(prev => [res.data, ...prev]);
      setNewTitle('');
      window.dispatchEvent(new CustomEvent('showNotification', { 
        detail: { message: 'Habit berhasil ditambahkan', type: 'success' } 
      }));
    } catch {
      window.dispatchEvent(new CustomEvent('showNotification', { 
        detail: { message: 'Gagal menambahkan habit', type: 'error' } 
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteHabit(id);
      setHabits(prev => prev.filter(h => h._id !== id));
      window.dispatchEvent(new CustomEvent('showNotification', { 
        detail: { message: 'Habit dihapus', type: 'success' } 
      }));
    } catch {
      window.dispatchEvent(new CustomEvent('showNotification', { 
        detail: { message: 'Gagal menghapus habit', type: 'error' } 
      }));
    }
  };

  // Calculate Progress
  const completedCount = habits.filter(h => h.completedDates.includes(selectedDate)).length;
  const progressPercent = habits.length === 0 ? 0 : Math.round((completedCount / habits.length) * 100);

  return (
    <div className="bg-white dark:bg-[#2a2a3e] border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
      
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{t('selfCare.dailyProgress')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{completedCount} {t('selfCare.of')} {habits.length} {t('selfCare.completed')}</p>
          </div>
          <span className="text-2xl font-bold text-[#5B7062] dark:text-[#A7BDAF] font-[Outfit]">
            {progressPercent}%
          </span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
          <div 
            className="bg-[#5B7062] dark:bg-[#8FA697] h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Add New Habit Form */}
      <form onSubmit={handleAddHabit} className="flex gap-2 mb-8">
        
        <input 
          type="text" 
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder={t('selfCare.newHabitPlaceholder')}
          className="flex-1 bg-gray-50 dark:bg-[#1a1a2e] border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#8FA697]"
        />
        
        <button 
          type="submit" 
          disabled={isSubmitting || !newTitle.trim()}
          className="bg-[#5B7062] hover:bg-[#4a5c50] disabled:bg-gray-300 dark:bg-[#8FA697] dark:hover:bg-[#7a8e81] dark:disabled:bg-gray-600 text-white rounded-xl px-4 py-2 flex items-center justify-center transition-colors"
        >
          <Plus size={18} />
        </button>
      </form>

      {/* Habit List */}
      <div className="flex flex-col gap-3">
        {habits.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 dark:text-gray-500 text-sm">{t('selfCare.noHabitsYet')}</p>
          </div>
        ) : (
          habits.map(habit => (
            <HabitItem 
              key={habit._id} 
              habit={habit} 
              selectedDate={selectedDate} 
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

    </div>
  );
};

export default HabitList;
