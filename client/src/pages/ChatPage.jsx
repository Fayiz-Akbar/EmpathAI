import { useState, useRef, useEffect } from 'react';
import ChatHeader from '../components/ChatHeader';
import ChatBubble from '../components/ChatBubble';
import MessageInput from '../components/MessageInput';
import Sidebar from '../components/Sidebar';
import { sendMessage as sendChatMessage } from '../services/chatService';

/**
 * ChatPage — Main chatbot interface.
 * Implements strict mobile-first bounds inside a desktop container.
 */
const ChatPage = () => {
  const [messages, setMessages] = useState(() => {
    return [
      {
        id: crypto.randomUUID(),
        isUser: false,
        text: "Hi there! 👋 I'm EmpathAI. How are you feeling today?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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
      const token = localStorage.getItem('empathAI_token');
      const sessionId = localStorage.getItem('empathAI_sessionId') || crypto.randomUUID();

      if (!localStorage.getItem('empathAI_sessionId')) {
        localStorage.setItem('empathAI_sessionId', sessionId);
      }

      const response = await sendChatMessage(messageText, sessionId, token);
      
      const aiMessage = {
        id: crypto.randomUUID(),
        isUser: false,
        text: response.reply || getFallbackResponse(messageText),
        time: getCurrentTime(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      
      const errorMessage = {
        id: crypto.randomUUID(),
        isUser: false,
        text: getFallbackResponse(messageText),
        time: getCurrentTime(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackResponse = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('stress') || lowerText.includes('stres')) {
      return "Saya mengerti kamu sedang merasa stres. Tarik napas dalam-dalam. Apakah ada hal spesifik yang memicu stresmu hari ini?";
    } else if (lowerText.includes('sedih') || lowerText.includes('sad')) {
      return "Terkadang merasa sedih adalah hal yang wajar. EmpathAI ada di sini untuk mendengarkan. Ingin menceritakan lebih lanjut?";
    } else if (lowerText.includes('cemas') || lowerText.includes('anxious')) {
      return "Kecemasan bisa sangat membebani. Coba fokus pada apa yang bisa kamu kendalikan saat ini. Apa yang sedang kamu khawatirkan?";
    } else {
      return "Terima kasih sudah berbagi. Saya di sini untuk mendukungmu. Bisakah kamu ceritakan sedikit lebih banyak tentang hal itu?";
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4 font-sans">
      {/* Ini adalah Wadah HP (Mobile Container) */}
      <div className="w-full max-w-[400px] h-[100dvh] sm:h-[850px] sm:rounded-[40px] bg-[#FAF9F6] relative shadow-2xl overflow-hidden flex flex-col">
        
        {/* Sidebar Overlay melayang (absolute) */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        {/* Header Chat */}
        <ChatHeader onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Area Obrolan (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          <div className="flex justify-center mb-1">
            <span className="px-3 py-1 text-[11px] font-semibold text-gray-400 bg-gray-200/50 rounded-full uppercase tracking-wider">
              Today
            </span>
          </div>

          {messages.map((msg) => (
            <ChatBubble 
              key={msg.id} 
              isUser={msg.isUser} 
              message={msg.text} 
              time={msg.time} 
            />
          ))}

          {isLoading && <ChatBubble isUser={false} isTyping={true} />}
          <div ref={chatEndRef} className="h-1 shrink-0" />
        </div>

        {/* Area Input (Bawah) */}
        <MessageInput onSend={handleSend} isLoading={isLoading} />

      </div>
    </div>
  );
};

export default ChatPage;
