import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatHeader from '../components/ChatHeader';
import ChatBubble from '../components/ChatBubble';
import MessageInput from '../components/MessageInput';
import Sidebar from '../components/Sidebar';
import { sendMessage as sendChatMessage, createSession, getHistory } from '../services/chatService';
import { isAuthenticated, getCurrentUser } from '../services/authService';

/**
 * ChatPage — Main chatbot interface.
 * Full-screen responsive layout: fills the entire viewport.
 */
const ChatPage = () => {
  const navigate = useNavigate();

  // ── Auth Guard ──
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  // ── State ──
  const [messages, setMessages] = useState([
    {
      id: crypto.randomUUID(),
      isUser: false,
      text: "Hi there! 👋 I'm EmpathAI. How are you feeling today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sessionId, setSessionId] = useState(() => localStorage.getItem('empathAI_sessionId') || '');
  const [chatSessions] = useState([]);

  const chatEndRef = useRef(null);

  // ── Auto-scroll on new message ──
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // ── Initialize session on mount ──
  useEffect(() => {
    const initSession = async () => {
      const user = getCurrentUser();
      if (!user) return;

      // If no session ID stored, create one
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

  // ── Load chat history when session changes ──
  const loadHistory = useCallback(async (sid) => {
    if (!sid) return;
    try {
      const result = await getHistory(sid);
      if (result.data && result.data.length > 0) {
        const historyMessages = [];
        result.data.forEach((chat) => {
          // User message
          historyMessages.push({
            id: chat._id + '_user',
            isUser: true,
            text: chat.message,
            time: new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });
          // AI response
          historyMessages.push({
            id: chat._id + '_ai',
            isUser: false,
            text: chat.response,
            time: new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            emotion: chat.emotion,
          });
        });

        setMessages([
          {
            id: 'welcome',
            isUser: false,
            text: "Hi there! 👋 I'm EmpathAI. How are you feeling today?",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
          ...historyMessages,
        ]);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  }, []);

  // ── Get current time string ──
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
      // Ensure we have a session
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
        // Server expects: { session_id, message }
        // Server returns: { message: 'Pesan terkirim', data: { response, emotion, ... } }
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
        throw new Error('No session available');
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
    if (!user) return;

    try {
      const result = await createSession(user.id, 'Sesi Curhat Baru');
      const newSessionId = result.session?._id || result.session?.id;
      if (newSessionId) {
        setSessionId(newSessionId);
        localStorage.setItem('empathAI_sessionId', newSessionId);
        setMessages([
          {
            id: crypto.randomUUID(),
            isUser: false,
            text: "Hi there! 👋 I'm EmpathAI. How are you feeling today?",
            time: getCurrentTime(),
          },
        ]);
      }
    } catch (error) {
      console.error('Failed to create new chat:', error);
    }
  };

  // ── Select session handler ──
  const handleSelectSession = async (sid) => {
    setSessionId(sid);
    localStorage.setItem('empathAI_sessionId', sid);
    await loadHistory(sid);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-stone-50 overflow-hidden">
      {/* Sidebar Overlay */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        chatSessions={chatSessions}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        activeSessionId={sessionId}
      />

      {/* Header */}
      <ChatHeader onMenuClick={() => setIsSidebarOpen(true)} />

      {/* Chat Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto no-scrollbar w-full">
        {/* Container for messages — centered on desktop */}
        <div className="w-full max-w-3xl mx-auto py-6 px-4 space-y-6">
          {/* Date Badge */}
          <div className="flex justify-center">
            <span className="px-3 py-1 text-[11px] font-semibold text-gray-400 bg-stone-200/50 rounded-full uppercase tracking-wider">
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
      <MessageInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
};

export default ChatPage;
