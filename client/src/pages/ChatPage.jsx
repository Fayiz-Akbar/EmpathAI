import { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, Zap, Heart, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChatHeader from '../components/ChatHeader';
import ChatBubble from '../components/ChatBubble';
import MessageInput from '../components/MessageInput';
import Sidebar from '../components/Sidebar';
import { sendMessage as sendChatMessage, createSession, getHistory } from '../services/chatService';
import { getCurrentUser } from '../services/authService';

const ChatPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [sessionId, setSessionId] = useState(() => localStorage.getItem('empathAI_sessionId') || '');
  
  const user = getCurrentUser(); // Cek status login
  const hasMessages = messages.length > 0;
  const chatEndRef = useRef(null);

  // Auto-scroll ke bawah saat ada pesan baru
  useEffect(() => {
    if (hasMessages) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, hasMessages]);

  // Load history jika ada sessionId
  useEffect(() => {
    if (sessionId && user) {
      loadHistory(sessionId);
    }
  }, [sessionId]);

  const loadHistory = async (sid) => {
    try {
      const result = await getHistory(sid);
      if (result.data) {
        const historyMessages = result.data.flatMap(chat => [
          { id: chat._id + '_u', isUser: true, text: chat.message, time: new Date(chat.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) },
          { id: chat._id + '_a', isUser: false, text: chat.response, time: new Date(chat.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), emotion: chat.emotion }
        ]);
        setMessages(historyMessages);
      }
    } catch (error) {
      console.error("Gagal memuat riwayat:", error);
    }
  };

  const handleSend = async (text) => {
    if (!text.trim()) return;
    
    // Jika belum login, arahkan ke login
    if (!user) {
      alert("Silakan login terlebih dahulu untuk mulai bercerita.");
      navigate('/login');
      return;
    }

    const userMsg = { id: Date.now(), isUser: true, text, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      let currentSid = sessionId;
      if (!currentSid) {
        const res = await createSession(user.id, text.slice(0, 30));
        currentSid = res.session._id;
        setSessionId(currentSid);
        localStorage.setItem('empathAI_sessionId', currentSid);
      }

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
    <div className="h-screen w-full flex overflow-hidden bg-slate-50 font-sans text-gray-800">
      <Sidebar 
        isDesktopOpen={isDesktopSidebarOpen} 
        activeSessionId={sessionId}
        onSelectSession={(id) => setSessionId(id)}
      />

      <div className="flex-1 flex flex-col h-full bg-white relative min-w-0">
        <ChatHeader user={user} onMenuClick={() => setIsMobileSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto no-scrollbar flex flex-col w-full">
          {!hasMessages ? (
            /* WELCOME STATE */
            <div className="flex-1 flex flex-col items-center justify-center w-full px-4 sm:px-8 pb-10">
              <div className="w-full max-w-3xl flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-left mb-8 pl-2">
                  <h1 className="text-5xl sm:text-6xl font-medium tracking-tight mb-2 leading-tight bg-gradient-to-r from-[#4b90ff] to-[#ff5546] bg-clip-text text-transparent font-[Outfit]">
                    Hi {user?.name?.split(' ')[0] || 'there'}
                  </h1>
                  <h2 className="text-4xl sm:text-5xl font-medium text-gray-300 tracking-tight leading-tight font-[Outfit]">
                    Where should we start?
                  </h2>
                </div>

                <MessageInput onSend={handleSend} isLoading={isLoading} />

                {/* Quick Actions */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-8">
                  <ActionButton icon={<Sparkles size={16} className="text-blue-500"/>} text="Analyze mood" onClick={() => handleSend("Bantu aku menganalisis suasana hatiku hari ini.")} />
                  <ActionButton icon={<Zap size={16} className="text-orange-500"/>} text="Anxiety relief" onClick={() => handleSend("Aku merasa cemas, bisa bantu tenangkan?")} />
                  <ActionButton icon={<Heart size={16} className="text-red-500"/>} text="Daily motivation" onClick={() => handleSend("Berikan aku motivasi untuk hari ini.")} />
                  <ActionButton icon={<Brain size={16} className="text-purple-500"/>} text="Stress management" onClick={() => handleSend("Tugas kuliah bikin stres, gimana cara mengatasinya?")} />
                </div>
              </div>
            </div>
          ) : (
            /* CHAT STATE */
            <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col px-4 sm:px-8 py-8 space-y-6">
              {messages.map((msg) => (
                <ChatBubble key={msg.id} {...msg} />
              ))}
              {isLoading && <div className="text-sm text-gray-400 animate-pulse">EmpathAI sedang berpikir...</div>}
              <div ref={chatEndRef} />
            </div>
          )}
        </main>

        {/* Footer Text untuk mode Welcome (saat chat kosong) */}
        {!hasMessages && (
            <div className="w-full text-center pb-4 text-xs text-gray-400">
                EmpathAI can make mistakes. Consider verifying important information.
            </div>
        )}

        {/* Footer Input untuk mode Chat */}
        {hasMessages && (
          <div className="w-full border-t border-gray-100 bg-white p-4 shrink-0">
            <div className="max-w-4xl mx-auto">
              <MessageInput onSend={handleSend} isLoading={isLoading} />
              <p className="text-[11px] text-gray-400 text-center mt-3 uppercase tracking-widest font-semibold">
                EmpathAI can make mistakes. Verify important info.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Sub-component untuk tombol aksi cepat
const ActionButton = ({ icon, text, onClick }) => (
  <button onClick={onClick} className="px-4 py-2.5 bg-white border border-gray-200 rounded-full flex items-center gap-2.5 hover:bg-slate-50 hover:border-blue-200 transition-all text-sm text-gray-600 font-medium shadow-sm active:scale-95">
    {icon} <span>{text}</span>
  </button>
);

export default ChatPage;