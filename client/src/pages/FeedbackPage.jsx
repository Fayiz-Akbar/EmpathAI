import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ChatHeader from '../components/ChatHeader';
import { getCurrentUser } from '../services/authService';
import { getUserSessions, renameSession, deleteSession, pinSession } from '../services/chatService';
import ConfirmDialog from '../components/ConfirmDialog';
import { useTranslation } from 'react-i18next';

const FeedbackPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = getCurrentUser();
  const userId = user ? (user._id || user.id) : null;
  
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  
  const [chatSessions, setChatSessions] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, sessionId: null });

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      try {
        const sessionsRes = await getUserSessions(userId);
        setChatSessions(sessionsRes.data || []);
      } catch (error) {
        console.error("Gagal memuat data:", error);
      }
    };
    fetchData();
  }, [userId]);

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
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity" onClick={() => setIsMobileSidebarOpen(false)} />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 md:static md:block transform transition-transform duration-300 ease-in-out h-full ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
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

      <div className="flex-1 flex flex-col h-full bg-[#FAF9F6] dark:bg-[#1a1a2e] relative min-w-0">
        <ChatHeader 
          user={user} 
          isDesktopSidebarOpen={isDesktopSidebarOpen}
          onMenuClick={() => { setIsMobileSidebarOpen(true); setIsDesktopSidebarOpen(!isDesktopSidebarOpen); }} 
        />

        <main className="flex-1 overflow-y-auto no-scrollbar p-6 lg:p-10">
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-6">
              <div>
                <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 font-[Outfit] flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#8FA697]/15 rounded-full flex items-center justify-center">
                    <MessageSquare className="text-[#5B7062] dark:text-[#A7BDAF]" size={28} />
                  </div>
                  {t('settings.feedback')}
                </h1>
              </div>
            </div>

            <div className="bg-white dark:bg-[#2a2a3e] p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 max-w-2xl">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Help us improve EmpathAI by sharing your thoughts.</p>
              
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Terima kasih atas tanggapan Anda!"); }}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                  <input type="text" className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2a3e] rounded-xl px-4 py-2.5 focus:ring-[#8FA697] focus:border-transparent outline-none" placeholder="What is this regarding?" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                  <textarea rows="5" className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2a3e] rounded-xl px-4 py-2.5 focus:ring-[#8FA697] focus:border-transparent outline-none resize-none" placeholder="Type your feedback here..." required></textarea>
                </div>
                <button type="submit" className="bg-[#8FA697] hover:bg-[#7A9182] text-white font-medium py-2.5 px-6 rounded-xl transition-colors">
                  Send Feedback
                </button>
              </form>
            </div>
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

export default FeedbackPage;
