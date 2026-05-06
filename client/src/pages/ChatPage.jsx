import { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, Zap, Heart, Brain } from 'lucide-react';
import ChatHeader from '../components/ChatHeader';
import ChatBubble from '../components/ChatBubble';
import MessageInput from '../components/MessageInput';
import Sidebar from '../components/Sidebar';
import { sendMessage as sendChatMessage, createSession, getHistory } from '../services/chatService';
import { getCurrentUser } from '../services/authService';

const ChatPage = () => {
  // ── State (TIDAK ADA YANG DIUBAH) ──
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [sessionId, setSessionId] = useState(() => localStorage.getItem('empathAI_sessionId') || '');
  const [chatSessions] = useState([]);

  const chatEndRef = useRef(null);
  const hasMessages = messages.length > 0;

  const userName = (() => {
    try {
      const storedUser = localStorage.getItem('empathAI_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        return user.name || null;
      }
    } catch {
      return null;
    }
    return null;
  })();

  useEffect(() => {
    if (hasMessages) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, hasMessages]);

  useEffect(() => {
    const initSession = async () => {
      const user = getCurrentUser();
      if (!user) return;
      if (!sessionId) {
        try {
          const result = await createSession(user.id, 'Sesi Curhat Baru');
          const newSessionId = result.session?._id || result.session?.id;
          if (newSessionId) {
            setSessionId(newSessionId);
            localStorage.setItem('empathAI_sessionId', newSessionId);
          }
        } catch (error) {
          console.error('Failed to create session:', error);
        }
      }
    };
    initSession();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadHistory = useCallback(async (sid) => {
    if (!sid) return;
    try {
      const result = await getHistory(sid);
      if (result.data && result.data.length > 0) {
        const historyMessages = [];
        result.data.forEach((chat) => {
          historyMessages.push({ id: chat._id + '_user', isUser: true, text: chat.message, time: new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
          historyMessages.push({ id: chat._id + '_ai', isUser: false, text: chat.response, time: new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), emotion: chat.emotion });
        });
        setMessages(historyMessages);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  }, []);

  const getCurrentTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const getFallbackResponse = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('stress') || lowerText.includes('stres')) return { reply: "Saya mengerti kamu sedang merasa stres. Tarik napas dalam-dalam. Apakah ada hal spesifik yang memicu stresmu hari ini?", emotion: 'Stres' };
    if (lowerText.includes('sedih') || lowerText.includes('sad')) return { reply: "Terkadang merasa sedih adalah hal yang wajar. EmpathAI ada di sini untuk mendengarkan. Ingin menceritakan lebih lanjut?", emotion: 'Sedih' };
    if (lowerText.includes('cemas') || lowerText.includes('anxious')) return { reply: "Kecemasan bisa sangat membebani. Coba fokus pada apa yang bisa kamu kendalikan saat ini. Apa yang sedang kamu khawatirkan?", emotion: 'Netral' };
    if (lowerText.includes('marah') || lowerText.includes('kesal')) return { reply: "Tarik napas dalam-dalam. Mari tenangkan pikiran sejenak.", emotion: 'Marah' };
    if (lowerText.includes('senang') || lowerText.includes('happy')) return { reply: "Wah, ikut bahagia mendengarnya! Pertahankan energi positif ini ya.", emotion: 'Senang' };
    return { reply: "Terima kasih sudah berbagi. Saya di sini untuk mendukungmu. Bisakah kamu ceritakan sedikit lebih banyak tentang hal itu?", emotion: 'Netral' };
  };

  const handleSend = async (messageText) => {
    if (!messageText.trim()) return;
    const userMessage = { id: crypto.randomUUID(), isUser: true, text: messageText, time: getCurrentTime() };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        const user = getCurrentUser();
        if (user) {
          const result = await createSession(user.id, messageText.slice(0, 50));
          currentSessionId = result.session?._id || result.session?.id;
          if (currentSessionId) {
            setSessionId(currentSessionId);
            localStorage.setItem('empathAI_sessionId', currentSessionId);
          }
        }
      }

      if (currentSessionId) {
        const response = await sendChatMessage(currentSessionId, messageText);
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), isUser: false, text: response.data?.response || getFallbackResponse(messageText).reply, time: getCurrentTime(), emotion: response.data?.emotion }]);
      } else {
        const fallback = getFallbackResponse(messageText);
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), isUser: false, text: fallback.reply, time: getCurrentTime(), emotion: fallback.emotion }]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const fallback = getFallbackResponse(messageText);
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), isUser: false, text: fallback.reply, time: getCurrentTime(), emotion: fallback.emotion }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = async () => {
    const user = getCurrentUser();
    if (user) {
      try {
        const result = await createSession(user.id, 'Sesi Curhat Baru');
        const newSessionId = result.session?._id || result.session?.id;
        if (newSessionId) {
          setSessionId(newSessionId);
          localStorage.setItem('empathAI_sessionId', newSessionId);
        }
      } catch (error) {
        console.error('Failed to create new chat:', error);
      }
    } else {
      setSessionId('');
      localStorage.removeItem('empathAI_sessionId');
    }
    setMessages([]);
  };

  const handleSelectSession = async (sid) => {
    setSessionId(sid);
    localStorage.setItem('empathAI_sessionId', sid);
    await loadHistory(sid);
  };

  // ── UI RENDER (DIUBAH STRUKTURNYA) ──
  return (
    <div className="h-screen w-full flex overflow-hidden bg-gray-50 font-sans">
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        isDesktopOpen={isDesktopSidebarOpen}
        onToggleMobile={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onToggleDesktop={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
        chatSessions={chatSessions}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        activeSessionId={sessionId}
      />

      <div className="flex-1 flex flex-col h-full bg-white relative min-w-0">
        <ChatHeader onMenuClick={() => setIsMobileSidebarOpen(true)} />

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col w-full">
          {!hasMessages ? (
            /* Welcome State (Centered vertically and horizontally) */
            <div className="flex-1 flex flex-col items-center justify-center w-full px-4 sm:px-8 pb-10">
              <div className="w-full max-w-[800px] flex flex-col">
                
                {/* Greeting */}
                <div className="text-left mb-8 pl-1 animate-fade-in-up">
                  <h1 className="text-[3.5rem] font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#4b90ff] to-[#ff5546] tracking-tight mb-2 font-[Outfit] leading-[1.1]">
                    {userName ? `Hi ${userName}` : 'Hi there'}
                  </h1>
                  <h2 className="text-[3.5rem] font-medium text-[#c4c7c5] tracking-tight font-[Outfit] leading-[1.1]">
                    Where should we start?
                  </h2>
                </div>

                {/* Input Area (Centered) */}
                <MessageInput onSend={handleSend} isLoading={isLoading} isCentered={true} />

                {/* Quick Action Chips (Pill shaped, below input) */}
                <div className="flex flex-wrap justify-center gap-3 mt-10 animate-fade-in-up delay-100">
                  {[
                    { text: 'Analyze mood', icon: <Sparkles size={18} className="text-blue-500" /> }, 
                    { text: 'Anxiety relief', icon: <Zap size={18} className="text-orange-500" /> }, 
                    { text: 'Daily motivation', icon: <Heart size={18} className="text-red-500" /> }, 
                    { text: 'Stress management', icon: <Brain size={18} className="text-purple-500" /> }
                  ].map((chip) => (
                    <button
                      key={chip.text}
                      onClick={() => handleSend(chip.text)}
                      className="px-5 py-3.5 bg-white border border-[#E0E0E0] rounded-full flex items-center gap-2.5 hover:bg-[#F0F4F9] transition-all text-[14px] text-[#444746] font-medium focus:outline-none shadow-sm hover:shadow-md"
                    >
                      {chip.icon}
                      <span>{chip.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Conversation State */
            <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col px-4 sm:px-8">
              <div className="py-6 space-y-6 pb-6">
                <div className="flex justify-center">
                  <span className="px-3 py-1 text-xs font-semibold text-gray-400 bg-gray-50 rounded-full uppercase tracking-wider">
                    Today
                  </span>
                </div>
                {messages.map((msg) => (
                  <ChatBubble key={msg.id} isUser={msg.isUser} message={msg.text} time={msg.time} emotion={msg.emotion} />
                ))}
                {isLoading && <ChatBubble isUser={false} isTyping={true} />}
                <div ref={chatEndRef} className="h-1 shrink-0" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area (Luar dari area scroll, nempel di bawah, HANYA TAMPIL SAAT ADA PESAN) */}
        {hasMessages && (
          <div className="w-full shrink-0 bg-white">
            <div className="w-full max-w-4xl mx-auto px-4 sm:px-8 pb-6 pt-2">
              <MessageInput onSend={handleSend} isLoading={isLoading} isCentered={false} />
              <div className="text-center mt-3">
                <span className="text-xs text-gray-500 font-medium">
                  EmpathAI can make mistakes. Consider verifying important information.
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ChatPage;