import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * MessageInput — Input area for sending chat messages.
 * Features auto-resizing textarea and centered container aligned with chat area.
 */
const MessageInput = ({ onSend, isLoading }) => {
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
      // Reset textarea height
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
    <div className="w-full bg-stone-50/95 backdrop-blur pb-safe">
      <div className="w-full max-w-3xl mx-auto px-4 pb-4 pt-2">
        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={isLoading}
              rows={1}
              className="w-full bg-white border border-stone-200 rounded-2xl px-4 py-3 text-[15px] text-[#4A5568] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#8FA697] focus:border-[#8FA697] transition-all resize-none disabled:opacity-70 disabled:bg-gray-50 leading-relaxed"
              style={{ maxHeight: '150px' }}
            />
          </div>

          {/* Send Button (Circle) */}
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="w-11 h-11 bg-[#8FA697] rounded-full flex items-center justify-center text-white shrink-0 hover:bg-[#7D9587] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95"
            aria-label="Send message"
          >
            {isLoading ? (
              <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-0.5">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

MessageInput.propTypes = {
  onSend: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default MessageInput;
