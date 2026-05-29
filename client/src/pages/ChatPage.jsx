import { useState, useRef, useEffect } from 'react';
import { Sparkles, Zap, Heart, Brain } from 'lucide-react';
// Remove unused useNavigate
import ChatHeader from '../components/ChatHeader';
import ChatBubble from '../components/ChatBubble';
import MessageInput from '../components/MessageInput';
import Sidebar from '../components/Sidebar';
import ConfirmDialog from '../components/ConfirmDialog';
import { getCurrentUser } from '../services/authService';
import { useTranslation } from 'react-i18next';
// Import digabungkan dan dirapikan:
import { 
  sendMessage as sendChatMessage, 
  createSession, 
  getHistory, 
  getUserSessions, 
  renameSession, 
  deleteSession,
  pinSession
} from '../services/chatService';

const ChatPage = () => {
  const { t } = useTranslation();
  // useNavigate removed
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [sessionId, setSessionId] = useState(() => localStorage.getItem('empathAI_sessionId') || '');
  
  const [chatSessions, setChatSessions] = useState([]); 

  // State untuk ConfirmDialog delete
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, sessionId: null });
  
  const user = getCurrentUser();
  const hasMessages = messages.length > 0;
  const chatEndRef = useRef(null);

  // Auto-scroll ke bawah saat ada pesan baru
  useEffect(() => {
    if (hasMessages) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, hasMessages]);

  // Load daftar riwayat sesi ke Sidebar saat halaman pertama dibuka
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const currentUserId = user ? (user._id || user.id) : null;
        if (currentUserId) {
          const res = await getUserSessions(currentUserId);
          if (res.data) {
            setChatSessions(res.data);
          }
        }
      } catch (error) {
        console.error("Gagal memuat daftar sesi:", error);
      }
    };

    loadSessions();
  }, [user?._id, user?.id]);

  // Load isi chat (history) dari satu sesi yang dipilih
  useEffect(() => {
    const loadHistory = async (sid) => {
      try {
        const result = await getHistory(sid);
        // PERBAIKAN 1: Pastikan data tidak kosong sebelum menimpa state messages
        if (result.data && result.data.length > 0) {
          const historyMessages = result.data.flatMap(chat => [
            { id: chat._id + '_u', isUser: true, text: chat.message, time: new Date(chat.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) },
            { id: chat._id + '_a', isUser: false, text: chat.response, time: new Date(chat.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), emotion: chat.emotion }
          ]);
          setMessages(historyMessages);
        }
      } catch (error) {
        console.error("Gagal memuat riwayat chat:", error);
      }
    };

    if (sessionId) { 
      loadHistory(sessionId);
    }
  }, [sessionId]); 

  const handleNewChat = () => {
    setSessionId('');
    setMessages([]);
    localStorage.removeItem('empathAI_sessionId');
    setIsMobileSidebarOpen(false);
  };

  const handleSelectSession = (id) => {
    // PERBAIKAN: Jika user mengeklik sesi yang sedang aktif, hentikan proses (jangan hapus layar)
    if (id === sessionId) {
      setIsMobileSidebarOpen(false); // Cukup tutup sidebar saja jika di HP
      return;
    }

    setMessages([]); 
    setSessionId(id);
    localStorage.setItem('empathAI_sessionId', id);
    setIsMobileSidebarOpen(false);
  };

  // --- FUNGSI RENAME & DELETE ---
  const handleRenameSession = async (id, newTitle) => {
    try {
      await renameSession(id, newTitle);
      // Update UI langsung tanpa harus refresh halaman
      setChatSessions(prev => prev.map(s => s._id === id ? { ...s, title: newTitle } : s));
    } catch (error) {
      console.error("Gagal mengubah nama sesi:", error);
    }
  };

  // Tampilkan ConfirmDialog saat user minta hapus
  const handleDeleteSession = (id) => {
    setDeleteConfirm({ isOpen: true, sessionId: id });
  };

  // Eksekusi hapus setelah user konfirmasi
  const confirmDeleteSession = async () => {
    const id = deleteConfirm.sessionId;
    setDeleteConfirm({ isOpen: false, sessionId: null });

    try {
      await deleteSession(id);
      // Hapus dari list sidebar
      setChatSessions(prev => prev.filter(s => s._id !== id));
      
      // Jika yang dihapus adalah chat yang sedang dibuka layarnya, bersihkan layarnya
      if (sessionId === id) {
        handleNewChat();
      }

      window.dispatchEvent(new CustomEvent('showNotification', { 
        detail: { message: 'Obrolan berhasil dihapus.', type: 'success' } 
      }));
    } catch (error) {
      console.error("Gagal menghapus sesi:", error);
      window.dispatchEvent(new CustomEvent('showNotification', { 
        detail: { message: 'Gagal menghapus obrolan.', type: 'error' } 
      }));
    }
  };
  
  const handlePinSession = async (id, isPinned) => {
    try {
      await pinSession(id, isPinned);
      setChatSessions(prev => {
        const targetIdx = prev.findIndex(s => s._id === id);
        if (targetIdx === -1) return prev;
        const target = { ...prev[targetIdx], isPinned };
        const others = prev.filter(s => s._id !== id);
        
        // Masukkan kembali dan urutkan: yang di-pin berada di atas
        const all = [target, ...others];
        return all.sort((a, b) => {
          if (a.isPinned === b.isPinned) return 0;
          return a.isPinned ? -1 : 1;
        });
      });
      window.dispatchEvent(new CustomEvent('showNotification', { 
        detail: { message: isPinned ? 'Sesi berhasil disematkan' : 'Sesi batal disematkan', type: 'success' } 
      }));
    } catch (error) {
      console.error("Gagal menyematkan sesi:", error);
      window.dispatchEvent(new CustomEvent('showNotification', { 
        detail: { message: 'Terjadi kesalahan sistem.', type: 'error' } 
      }));
    }
  };
  // -------------------------------------------------

  const handleSend = async (text) => {
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), isUser: true, text, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      let currentSid = sessionId;

      // --- LOGIKA GUEST & USER ---
      if (!user) {
        // Jika Tamu: Jangan buat sesi DB, pakai ID khusus
        currentSid = 'guest'; 
      } else if (!currentSid) {
        // Jika User (Login) dan belum ada sesi: Buat sesi baru di DB
        const userIdToUse = user._id || user.id;
        const res = await createSession(userIdToUse, text.slice(0, 30));
        currentSid = res.session._id;
        setSessionId(currentSid);
        localStorage.setItem('empathAI_sessionId', currentSid);
        
        setChatSessions(prev => [{ _id: currentSid, title: text.slice(0, 30) }, ...prev]);
      }

      // Kirim pesan (baik sebagai guest maupun user)
      const res = await sendChatMessage(currentSid, text);
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        isUser: false,
        text: res.data.response,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        emotion: res.data.emotion
      }]);
    } catch (error) {
      console.error("Error kirim pesan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#FAF9F6] dark:bg-[#121220] font-sans text-gray-800 dark:text-gray-100 relative">
      
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-50 md:static md:block
        transform transition-transform duration-300 ease-in-out h-full
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar 
          isDesktopOpen={isDesktopSidebarOpen} 
          onToggleDesktop={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
          chatSessions={chatSessions}
          activeSessionId={sessionId}
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
          onMenuClick={() => {
            setIsMobileSidebarOpen(true);
            setIsDesktopSidebarOpen(!isDesktopSidebarOpen);
          }} 
        />

        <main className="flex-1 overflow-y-auto no-scrollbar flex flex-col w-full">
          {!hasMessages ? (
            <div className="flex-1 flex flex-col w-full px-4 sm:px-8 pb-6 pt-10 md:pt-20 relative">
              {/* Background Ambient Blobs */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center z-0">
                <div className="absolute w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-teal-100 dark:bg-emerald-900/30 rounded-full blur-[80px] md:blur-[120px] opacity-60 animate-breathing -translate-x-1/3 -translate-y-1/4"></div>
                <div className="absolute w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-indigo-50 dark:bg-indigo-900/30 rounded-full blur-[80px] md:blur-[120px] opacity-60 animate-breathing translate-x-1/3 translate-y-1/4" style={{ animationDelay: '2s' }}></div>
              </div>

              <div className="w-full max-w-3xl mx-auto flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
                {/* Top Section: Sapaan (Centered) */}
                <div className="text-center mb-12 mt-8 md:mt-12">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight mb-3 leading-tight text-gray-700 dark:text-gray-200 font-sans">
                    {t('chat.hi')}, {user?.name?.split(' ')[0] || ''}
                  </h1>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-gray-400 dark:text-gray-500 tracking-tight leading-tight font-sans">
                    {t('chat.whereToStart')}
                  </h2>
                </div>

                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 w-full px-2">
                  <ActionButton icon={<Sparkles size={16} className="text-[#8FA697] shrink-0"/>} text={t('chat.analyzeMood')} onClick={() => handleSend("Bantu aku menganalisis suasana hatiku hari ini.")} />
                  <ActionButton icon={<Zap size={16} className="text-[#8FA697] shrink-0"/>} text={t('chat.anxietyRelief')} onClick={() => handleSend("Aku merasa cemas, bisa bantu tenangkan?")} />
                  <ActionButton icon={<Heart size={16} className="text-[#8FA697] shrink-0"/>} text={t('chat.dailyMotivation')} onClick={() => handleSend("Berikan aku motivasi untuk hari ini.")} />
                  <ActionButton icon={<Brain size={16} className="text-[#8FA697] shrink-0"/>} text={t('chat.stressManagement')} onClick={() => handleSend("Banyak tugas hari ini bikin stres, gimana cara mengatasinya?")} />
                </div>

                {/* Spacer untuk mendorong MessageInput ke bawah */}
                <div className="flex-1 min-h-[40px]" />

                {/* Bottom Section: Message Input selalu di bawah */}
                <div className="w-full mt-auto">
                  <MessageInput onSend={handleSend} isLoading={isLoading} isCentered={false} />
                  
                  <div className="w-full text-center mt-4 text-[10px] sm:text-xs text-gray-400 dark:text-gray-600 px-4">
                    {t('chat.disclaimer')}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col px-4 sm:px-8 py-8 space-y-6">
              {messages.map((msg) => (
                <ChatBubble key={msg.id} {...msg} />
              ))}
              {isLoading && <div className="text-sm text-gray-400 dark:text-gray-500 animate-pulse">EmpathAI sedang berpikir...</div>}
              <div ref={chatEndRef} />
            </div>
          )}
        </main>



        {hasMessages && (
          <div className="w-full border-t border-gray-100 dark:border-gray-700 bg-[#FAF9F6] dark:bg-[#1a1a2e] p-4 shrink-0">
            <div className="max-w-4xl mx-auto">
              <MessageInput onSend={handleSend} isLoading={isLoading} />
              <p className="text-[10px] sm:text-[11px] text-gray-400 dark:text-gray-600 text-center mt-3 uppercase tracking-widest font-semibold">
                {t('chat.disclaimer')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Dialog konfirmasi hapus — menggantikan window.confirm() */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title={t('chat.deleteChat')}
        message="Yakin ingin menghapus riwayat obrolan ini? Tindakan ini tidak dapat dibatalkan."
        confirmText={t('chat.deleteChat')}
        cancelText={t('auth.cancel')}
        variant="danger"
        onConfirm={confirmDeleteSession}
        onCancel={() => setDeleteConfirm({ isOpen: false, sessionId: null })}
      />
    </div>
  );
};

const ActionButton = ({ icon, text, onClick }) => (
  <button 
    onClick={onClick} 
    className="px-4 py-2.5 bg-white/60 dark:bg-[#2a2a3e]/60 backdrop-blur-md border border-white/50 dark:border-gray-600/50 rounded-full flex items-center gap-2 hover:bg-white/80 dark:hover:bg-[#33334a]/80 transition-all text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium shadow-sm active:scale-95 whitespace-nowrap"
  >
    {icon} <span>{text}</span>
  </button>
);

export default ChatPage;