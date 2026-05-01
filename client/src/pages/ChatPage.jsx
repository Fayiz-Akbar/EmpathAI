import { useState, useRef, useEffect } from 'react';
import ChatHeader from '../components/ChatHeader';
import ChatBubble from '../components/ChatBubble';
import MessageInput from '../components/MessageInput';
import { sendMessage as sendChatMessage } from '../services/chatService';

/**
 * ChatPage — Main chatbot interface.
 * Uses modular ChatHeader, ChatBubble, and MessageInput components.
 * Manages message state and communicates with the chat API.
 */
const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      isUser: false,
      text: "Hi there! 👋 I'm EmpathAI. How are you feeling today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  /**
   * Scroll to bottom whenever messages change.
   */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Formats current time as HH:MM string.
   */
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  /**
   * Handles sending a message — adds user message, calls API, adds AI response.
   */
  const handleSend = async (messageText) => {
    // Add user message immediately
    const userMessage = {
      id: Date.now(),
      isUser: true,
      text: messageText,
      time: getCurrentTime(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Attempt to call the server API
      const sessionId = localStorage.getItem('empathAI_sessionId');
      const response = await sendChatMessage(sessionId, messageText);

      const aiMessage = {
        id: Date.now() + 1,
        isUser: false,
        text: response.data?.response || "I hear you. Tell me more about how you're feeling.",
        time: getCurrentTime(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      // Fallback: rule-based response if API is unavailable
      const fallbackResponse = getFallbackResponse(messageText);
      const aiMessage = {
        id: Date.now() + 1,
        isUser: false,
        text: fallbackResponse,
        time: getCurrentTime(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Simple rule-based fallback when the server is unreachable.
   */
  const getFallbackResponse = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('stres') || lower.includes('capek') || lower.includes('burnout') || lower.includes('stressed') || lower.includes('tired')) {
      return "You seem exhausted. Remember, it's okay to take a break. Your well-being matters more than anything. 💚";
    }
    if (lower.includes('sedih') || lower.includes('kecewa') || lower.includes('sad') || lower.includes('disappointed')) {
      return "I'm here for you. It's completely okay to feel sad — your emotions are valid. Would you like to talk about what's bothering you? 🤗";
    }
    if (lower.includes('marah') || lower.includes('kesal') || lower.includes('angry') || lower.includes('frustrated')) {
      return "Take a deep breath with me. Let's try to calm our minds together. What made you feel this way? 🌿";
    }
    if (lower.includes('senang') || lower.includes('happy') || lower.includes('bahagia') || lower.includes('great')) {
      return "That's wonderful to hear! 🌟 I'm so happy for you. Keep nurturing that positive energy!";
    }
    if (lower.includes('cemas') || lower.includes('anxious') || lower.includes('worry') || lower.includes('takut')) {
      return "Anxiety can feel overwhelming, but you're not alone. Let's take things one step at a time. What's on your mind? 🌸";
    }
    return "I'm listening. Feel free to share anything — this is your safe space. 💚";
  };

  return (
    <div className="max-w-md mx-auto w-full h-screen bg-[#FAF9F6] flex flex-col relative shadow-xl overflow-hidden">
      {/* Header */}
      <ChatHeader />

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {/* Today Timestamp */}
        <div className="flex justify-center my-2">
          <span className="px-3 py-1 bg-white/80 text-[10px] font-semibold text-gray-400 rounded-full shadow-sm tracking-wider uppercase">
            Today
          </span>
        </div>

        {/* Message Bubbles */}
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            isUser={msg.isUser}
            message={msg.text}
            time={msg.time}
          />
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex gap-2.5 max-w-[85%] animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-[#8FA697] flex-shrink-0 flex items-center justify-center text-white mt-auto mb-1 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
                <path d="M9 13v2"/>
                <path d="M15 13v2"/>
              </svg>
            </div>
            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-50 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={chatEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
};

export default ChatPage;
