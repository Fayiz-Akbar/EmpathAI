import { useState, useRef, useEffect, useCallback } from 'react';
import ChatHeader from '../components/ChatHeader';
import ChatBubble from '../components/ChatBubble';
import MessageInput from '../components/MessageInput';
import Sidebar from '../components/Sidebar';
import { sendMessage as sendChatMessage, createSession, getHistory } from '../services/chatService';
import { getCurrentUser } from '../services/authService';

/**
 * ChatPage — Gemini-style chat interface.
 * Two states:
 *   1. Welcome (no messages): centered greeting + input.
 *   2. Conversation (has messages): scrollable thread + bottom input.
 *
 * Sidebar is persistent on desktop (lg+), overlay drawer on mobile.
 * No login required — works for both guests and authenticated users.
 */
const ChatPage = () => {
  // ── State ──
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sessionId, setSessionId] = useState(() => localStorage.getItem('empathAI_sessionId') || '');
  const [chatSessions] = useState([]);

  const chatEndRef = useRef(null);
  const hasMessages = messages.length > 0;

  // ── Derive user name for greeting ──
  const userName = (() => {
    try {
      const storedUser = localStorage.getItem('empathAI_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        return user.name || null;
      }
    } catch {
      // silently ignore
    }
    return null;
  })();

  // ── Auto-scroll on new message ──
  useEffect(() => {
    if (hasMessages) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, hasMessages]);

  // ── Initialize session on mount (only if authenticated) ──
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

  // ── Load chat history ──
  const loadHistory = useCallback(async (sid) => {
    if (!sid) return;
    try {
      const result = await getHistory(sid);
      if (result.data && result.data.length > 0) {
        const historyMessages = [];
        result.data.forEach((chat) => {
          historyMessages.push({
            id: chat._id + '_user',
            isUser: true,
            text: chat.message,
            time: new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });
          historyMessages.push({
            id: chat._id + '_ai',
            isUser: false,
            text: chat.response,
            time: new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            emotion: chat.emotion,
          });
        });
        setMessages(historyMessages);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  }, []);

  // ── Get current time ──
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // ── Fallback response when API is unavailable ──
  const getFallbackResponse = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('stress') || lowerText.includes('stres')) {
      return { reply: "Saya mengerti kamu sedang merasa stres. Tarik napas dalam-dalam. Apakah ada hal spesifik yang memicu stresmu hari ini?", emotion: 'Stres' };
    } else if (lowerText.includes('sedih') || lowerText.includes('sad')) {
      return { reply: "Terkadang merasa sedih adalah hal yang wajar. EmpathAI ada di sini untuk mendengarkan. Ingin menceritakan lebih lanjut?", emotion: 'Sedih' };
    } else if (lowerText.includes('cemas') || lowerText.includes('anxious')) {
      return { reply: "Kecemasan bisa sangat membebani. Coba fokus pada apa yang bisa kamu kendalikan saat ini. Apa yang sedang kamu khawatirkan?", emotion: 'Netral' };
    } else if (lowerText.includes('marah') || lowerText.includes('kesal')) {
      return { reply: "Tarik napas dalam-dalam. Mari tenangkan pikiran sejenak.", emotion: 'Marah' };
    } else if (lowerText.includes('senang') || lowerText.includes('happy')) {
      return { reply: "Wah, ikut bahagia mendengarnya! Pertahankan energi positif ini ya.", emotion: 'Senang' };
    }
    return { reply: "Terima kasih sudah berbagi. Saya di sini untuk mendukungmu. Bisakah kamu ceritakan sedikit lebih banyak tentang hal itu?", emotion: 'Netral' };
  };

  // ── Send message handler ──
  const handleSend = async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: crypto.randomUUID(),
      isUser: true,
      text: messageText,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      let currentSessionId = sessionId;

      // Try to create a session if authenticated and none exists
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
        const aiMessage = {
          id: crypto.randomUUID(),
          isUser: false,
          text: response.data?.response || getFallbackResponse(messageText).reply,
          time: getCurrentTime(),
          emotion: response.data?.emotion,
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        // Guest mode — use fallback response
        const fallback = getFallbackResponse(messageText);
        const aiMessage = {
          id: crypto.randomUUID(),
          isUser: false,
          text: fallback.reply,
          time: getCurrentTime(),
          emotion: fallback.emotion,
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const fallback = getFallbackResponse(messageText);
      const errorMessage = {
        id: crypto.randomUUID(),
        isUser: false,
        text: fallback.reply,
        time: getCurrentTime(),
        emotion: fallback.emotion,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // ── New chat handler ──
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
      // Guest: just clear session
      setSessionId('');
      localStorage.removeItem('empathAI_sessionId');
    }

    // Reset to welcome screen
    setMessages([]);
  };

  // ── Select session handler ──
  const handleSelectSession = async (sid) => {
    setSessionId(sid);
    localStorage.setItem('empathAI_sessionId', sid);
    await loadHistory(sid);
  };

  return (
    <div className="h-screen w-full flex bg-[#FAF9F6] overflow-hidden">
      {/* Sidebar — persistent on lg+, overlay on mobile */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        chatSessions={chatSessions}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        activeSessionId={sessionId}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Header */}
        <ChatHeader onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Content: Welcome or Conversation */}
        {!hasMessages ? (
          /* ═══ Welcome State (like Gemini home) ═══ */
          <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 pb-32">
            {/* Greeting */}
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#8FA697] to-[#B5C9BC] mb-3 font-[Outfit]">
                {userName ? `Hi ${userName}` : 'Hi there'}
              </h2>
              <p className="text-3xl sm:text-4xl font-semibold text-[#4A5568] font-[Outfit]">
                How are you feeling today?
              </p>
            </div>

            {/* Input */}
            <div className="w-full max-w-3xl">
              <MessageInput onSend={handleSend} isLoading={isLoading} hasMessages={false} />
            </div>

            {/* Quick Action Chips */}
            <div className="flex flex-wrap justify-center gap-3 mt-8 max-w-2xl">
              {['I feel stressed 😰', 'Feeling anxious 😟', 'I\'m feeling happy 😊', 'Need motivation 💪'].map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSend(chip)}
                  className="px-4 py-2 text-[13px] text-[#5F6368] border border-[#DDD9D0] rounded-full hover:bg-[#E8E5DE] transition-colors duration-200"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* ═══ Conversation State ═══ */
          <>
            {/* Chat Area (Scrollable) */}
            <div className="flex-1 overflow-y-auto no-scrollbar w-full">
              <div className="w-full max-w-3xl mx-auto py-6 px-4 space-y-6">
                {/* Date Badge */}
                <div className="flex justify-center">
                  <span className="px-3 py-1 text-[11px] font-semibold text-[#9CA3AF] bg-[#E8E5DE]/60 rounded-full uppercase tracking-wider">
                    Today
                  </span>
                </div>

                {/* Messages */}
                {messages.map((msg) => (
                  <ChatBubble
                    key={msg.id}
                    isUser={msg.isUser}
                    message={msg.text}
                    time={msg.time}
                    emotion={msg.emotion}
                  />
                ))}

                {/* Typing Indicator */}
                {isLoading && <ChatBubble isUser={false} isTyping={true} />}

                <div ref={chatEndRef} className="h-1 shrink-0" />
              </div>
            </div>

            {/* Input Area (Bottom) */}
            <MessageInput onSend={handleSend} isLoading={isLoading} hasMessages={true} />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
