import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * MessageInput — Gemini-style centered input box.
 * When hasMessages is false: renders as a standalone centered input (home state).
 * When hasMessages is true: renders at the bottom of the chat area.
 */
const MessageInput = ({ onSend, isLoading, hasMessages = true }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={`w-full ${hasMessages ? 'bg-[#FAF9F6]/95 backdrop-blur-sm pb-safe' : ''}`}>
      <div className="w-full max-w-3xl mx-auto px-4 pb-6 pt-2">
        <form onSubmit={handleSubmit} className="relative">
          {/* Input Container — rounded box with border like Gemini */}
          <div className="flex items-end bg-white border border-[#DDD9D0] rounded-[2rem] px-6 py-3 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] focus-within:border-[#8FA697] focus-within:shadow-[0_4px_16px_-4px_rgba(143,166,151,0.2)] transition-all duration-300">
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tell EmpathAI how you feel..."
              disabled={isLoading}
              rows={1}
              className="flex-1 bg-transparent text-[16px] text-[#1E293B] placeholder-[#9CA3AF] focus:outline-none resize-none py-1.5 disabled:opacity-70 overflow-hidden"
              style={{ maxHeight: '150px' }}
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className="w-10 h-10 bg-[#8FA697] rounded-full flex items-center justify-center text-white shrink-0 ml-3 hover:bg-[#7D9587] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
              aria-label="Send message"
            >
              {isLoading ? (
                <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

MessageInput.propTypes = {
  onSend: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  hasMessages: PropTypes.bool,
};

export default MessageInput;
