import { useState, useRef, useEffect } from 'react';
import { Sparkles, Zap, Heart, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChatHeader from '../components/ChatHeader';
import ChatBubble from '../components/ChatBubble';
import MessageInput from '../components/MessageInput';
import Sidebar from '../components/Sidebar';
import { getCurrentUser } from '../services/authService';
// Import digabungkan dan dirapikan:
import { 
  sendMessage as sendChatMessage, 
  createSession, 
  getHistory, 
  getUserSessions, 
  renameSession, 
  deleteSession 
} from '../services/chatService';

const ChatPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [sessionId, setSessionId] = useState(() => localStorage.getItem('empathAI_sessionId') || '');
  
  const [chatSessions, setChatSessions] = useState([]); 
  
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
  }, []); 

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

  const handleDeleteSession = async (id) => {
    // Konfirmasi sebelum menghapus agar aman
    if (!window.confirm("Yakin ingin menghapus riwayat obrolan ini?")) return;
    
    try {
      await deleteSession(id);
      // Hapus dari list sidebar
      setChatSessions(prev => prev.filter(s => s._id !== id));
      
      // Jika yang dihapus adalah chat yang sedang dibuka layarnya, bersihkan layarnya
      if (sessionId === id) {
        handleNewChat();
      }
    } catch (error) {
      console.error("Gagal menghapus sesi:", error);
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
    <div className="h-screen w-full flex overflow-hidden bg-slate-50 dark:bg-[#121220] font-sans text-gray-800 dark:text-gray-100 relative">
      
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
        />
      </div>

      <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#1a1a2e] relative min-w-0">
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
            <div className="flex-1 flex flex-col items-center justify-center w-full px-4 sm:px-8 pb-10">
              <div className="w-full max-w-3xl flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700 mt-8 md:mt-0">
                <div className="text-left mb-8 pl-2">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight mb-2 leading-tight bg-linear-to-r from-[#4b90ff] to-[#ff5546] bg-clip-text text-transparent font-[Outfit]">
                    Hi {user?.name?.split(' ')[0] || 'there'}
                  </h1>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-gray-300 dark:text-gray-600 tracking-tight leading-tight font-[Outfit]">
                    Where should we start?
                  </h2>
                </div>

                <MessageInput onSend={handleSend} isLoading={isLoading} />

                <div className="flex flex-wrap gap-2 sm:gap-3 mt-8 w-full px-2">
                  <ActionButton icon={<Sparkles size={16} className="text-blue-500 shrink-0"/>} text="Analyze mood" onClick={() => handleSend("Bantu aku menganalisis suasana hatiku hari ini.")} />
                  <ActionButton icon={<Zap size={16} className="text-orange-500 shrink-0"/>} text="Anxiety relief" onClick={() => handleSend("Aku merasa cemas, bisa bantu tenangkan?")} />
                  <ActionButton icon={<Heart size={16} className="text-red-500 shrink-0"/>} text="Daily motivation" onClick={() => handleSend("Berikan aku motivasi untuk hari ini.")} />
                  <ActionButton icon={<Brain size={16} className="text-purple-500 shrink-0"/>} text="Stress management" onClick={() => handleSend("Tugas kuliah bikin stres, gimana cara mengatasinya?")} />
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

        {!hasMessages && (
            <div className="w-full text-center pb-4 pt-4 text-[10px] sm:text-xs text-gray-400 dark:text-gray-600 px-4">
                EmpathAI can make mistakes. Consider verifying important information.
            </div>
        )}

        {hasMessages && (
          <div className="w-full border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-[#1a1a2e] p-4 shrink-0">
            <div className="max-w-4xl mx-auto">
              <MessageInput onSend={handleSend} isLoading={isLoading} />
              <p className="text-[10px] sm:text-[11px] text-gray-400 dark:text-gray-600 text-center mt-3 uppercase tracking-widest font-semibold">
                EmpathAI can make mistakes. Verify important info.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ActionButton = ({ icon, text, onClick }) => (
  <button 
    onClick={onClick} 
    className="px-3 sm:px-4 py-2 sm:py-2.5 bg-white dark:bg-[#2a2a3e] border border-gray-200 dark:border-gray-600 rounded-full flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-[#33334a] hover:border-blue-200 dark:hover:border-blue-700 transition-all text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium shadow-sm active:scale-95 whitespace-nowrap"
  >
    {icon} <span>{text}</span>
  </button>
);

export default ChatPage;