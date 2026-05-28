import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ChatHeader from '../components/ChatHeader';
import HabitList from '../components/HabitList';
import { getCurrentUser } from '../services/authService';
import { getHabits } from '../services/habitService';
import { getUserSessions, renameSession, deleteSession, pinSession } from '../services/chatService';
import { useTranslation } from 'react-i18next';
import ConfirmDialog from '../components/ConfirmDialog';

const getLocalDateString = (dateObj) => {
  // Returns string in local YYYY-MM-DD format regardless of UTC offset
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const SelfCarePage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const userId = user ? (user._id || user.id) : null;
  
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const { t } = useTranslation();
  
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Date Management
  const [currentDate, setCurrentDate] = useState(new Date());
  const selectedDateString = getLocalDateString(currentDate);

  // Sidebar specific state (to keep sidebar functional)
  const [chatSessions, setChatSessions] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, sessionId: null });

  // Redirect if not logged in
  useEffect(() => {
    if (!userId) navigate('/login');
  }, [userId, navigate]);

  // Fetch Habits and Sidebar Sessions
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      setIsLoading(true);
      try {
        const [habitsRes, sessionsRes] = await Promise.all([
          getHabits(),
          getUserSessions(userId)
        ]);
        setHabits(habitsRes.data || []);
        setChatSessions(sessionsRes.data || []);
      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  // Date Navigation Handlers
  const handlePrevDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    setCurrentDate(prev);
  };

  const handleNextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };
  
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = getLocalDateString(new Date()) === selectedDateString;

  // Sidebar Handlers
  const handleNewChat = () => {
    localStorage.removeItem('empathAI_sessionId');
    navigate('/chat');
  };
  const handleSelectSession = (id) => {
    localStorage.setItem('empathAI_sessionId', id);
    navigate('/chat');
  };
  const handleRenameSession = async (id, newTitle) => {
    try {
      await renameSession(id, newTitle);
      setChatSessions(prev => prev.map(s => s._id === id ? { ...s, title: newTitle } : s));
    } catch { /* ignore error */ }
  };
  const handleDeleteSession = (id) => setDeleteConfirm({ isOpen: true, sessionId: id });
  const confirmDeleteSession = async () => {
    const id = deleteConfirm.sessionId;
    setDeleteConfirm({ isOpen: false, sessionId: null });
    try {
      await deleteSession(id);
      setChatSessions(prev => prev.filter(s => s._id !== id));
      window.dispatchEvent(new CustomEvent('showNotification', { detail: { message: 'Obrolan dihapus.', type: 'success' } }));
    } catch { /* ignore error */ }
  };
  const handlePinSession = async (id, isPinned) => {
    try {
      await pinSession(id, isPinned);
      setChatSessions(prev => {
        const targetIdx = prev.findIndex(s => s._id === id);
        if (targetIdx === -1) return prev;
        const target = { ...prev[targetIdx], isPinned };
        const others = prev.filter(s => s._id !== id);
        return [target, ...others].sort((a, b) => {
          if (a.isPinned === b.isPinned) return 0;
          return a.isPinned ? -1 : 1;
        });
      });
    } catch { /* ignore error */ }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#FAF9F6] dark:bg-[#121220] font-sans text-gray-800 dark:text-gray-100 relative">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 md:static md:block
        transform transition-transform duration-300 ease-in-out h-full
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar 
          isDesktopOpen={isDesktopSidebarOpen} 
          onToggleDesktop={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
          chatSessions={chatSessions}
          activeSessionId={null} 
          onSelectSession={handleSelectSession}
          onNewChat={handleNewChat}
          onRenameSession={handleRenameSession}
          onDeleteSession={handleDeleteSession}
          onPinSession={handlePinSession}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full bg-[#FAF9F6] dark:bg-[#1a1a2e] relative min-w-0">
        <ChatHeader 
          user={user} 
          isDesktopSidebarOpen={isDesktopSidebarOpen}
          onMenuClick={() => {
            setIsMobileSidebarOpen(true);
            setIsDesktopSidebarOpen(!isDesktopSidebarOpen);
          }} 
        />

        <main className="flex-1 overflow-y-auto no-scrollbar p-6 lg:p-10">
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 font-[Outfit] flex items-center gap-3">
                  <Heart className="text-[#5B7062] dark:text-[#A7BDAF]" size={32} />
                  {t('selfCare.title')}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">{t('selfCare.desc')}</p>
              </div>
              
              {/* Date Navigator */}
              <div className="flex items-center gap-3 bg-white dark:bg-[#2a2a3e] border border-gray-100 dark:border-gray-700 p-2 rounded-xl shadow-sm">
                <button onClick={handlePrevDay} className="p-2 text-gray-500 hover:text-[#5B7062] hover:bg-[#8FA697]/10 rounded-lg transition-colors">
                  <ChevronLeft size={20} />
                </button>
                <div className="flex flex-col items-center justify-center min-w-[120px]">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {currentDate.toLocaleDateString('id-ID', { weekday: 'long' })}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {currentDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <button 
                  onClick={handleNextDay} 
                  disabled={isToday}
                  className="p-2 text-gray-500 hover:text-[#5B7062] hover:bg-[#8FA697]/10 disabled:opacity-30 disabled:hover:bg-transparent rounded-lg transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
                {!isToday && (
                  <button onClick={handleToday} className="ml-2 p-2 bg-[#8FA697]/15 text-[#5B7062] dark:bg-[#8FA697]/20 dark:text-[#A7BDAF] hover:bg-[#8FA697]/25 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium">
                    <Calendar size={16} /> {t('selfCare.today')}
                  </button>
                )}
              </div>
            </div>

            {/* Content Section */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <span className="text-sm font-medium text-gray-400 animate-pulse">Memuat data...</span>
              </div>
            ) : (
              <HabitList 
                habits={habits} 
                setHabits={setHabits} 
                selectedDate={selectedDateString} 
              />
            )}

          </div>
        </main>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Hapus Obrolan"
        message="Yakin ingin menghapus riwayat obrolan ini?"
        confirmText="Hapus"
        cancelText="Batal"
        variant="danger"
        onConfirm={confirmDeleteSession}
        onCancel={() => setDeleteConfirm({ isOpen: false, sessionId: null })}
      />
    </div>
  );
};

export default SelfCarePage;
