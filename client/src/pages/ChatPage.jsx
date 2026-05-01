import { useState, useRef, useEffect } from 'react';
import ChatHeader from '../components/ChatHeader';
import ChatBubble from '../components/ChatBubble';
import MessageInput from '../components/MessageInput';
import Sidebar from '../components/Sidebar';
import { sendMessage as sendChatMessage } from '../services/chatService';

/**
 * ChatPage — Main chatbot interface.
 * Uses modular ChatHeader, ChatBubble, MessageInput, and Sidebar components.
 * Manages message state and communicates with the chat API.
 */
const ChatPage = () => {
  const [messages, setMessages] = useState(() => [
    {
      id: crypto.randomUUID(),
      isUser: false,
      text: "Hi there! 👋 I'm EmpathAI. How are you feeling today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const chatEndRef = useRef(null);

  /**
   * Scroll to bottom whenever messages change.
   */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

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
      id: crypto.randomUUID(),
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
        id: crypto.randomUUID(),
        isUser: false,
        text: response.data?.response || "I hear you. Tell me more about how you're feeling.",
        time: getCurrentTime(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      // Fallback: rule-based response if API is unavailable
      const fallbackResponse = getFallbackResponse(messageText);
      const aiMessage = {
        id: crypto.randomUUID(),
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
    <div className="max-w-md mx-auto w-full h-screen bg-[#FAF9F6] relative shadow-lg overflow-hidden flex flex-col">
      
      {/* Sidebar Component */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Header */}
      <ChatHeader onMenuClick={() => setIsSidebarOpen(true)} />

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4">
        {/* Today Timestamp */}
        <div className="flex justify-center mb-1 mt-2">
          <span className="px-3 py-1 text-[11px] font-semibold text-gray-400 bg-gray-100/50 rounded-full uppercase tracking-wider">
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
          <ChatBubble isUser={false} isTyping={true} />
        )}

        {/* Scroll anchor */}
        <div ref={chatEndRef} className="h-1" />
      </div>

      {/* Message Input */}
      <MessageInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
};

export default ChatPage;
