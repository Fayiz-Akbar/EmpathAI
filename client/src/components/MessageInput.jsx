import { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * MessageInput — Input area for sending chat messages.
 * Enforces precise layout classes as requested.
 */
const MessageInput = ({ onSend, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full p-4 bg-white flex-shrink-0">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        {/* Plus Button */}
        <button 
          type="button" 
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
          aria-label="Add attachment"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        {/* Text Input Pill */}
        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={isLoading}
            className="w-full bg-[#F3F4F6] border-0 rounded-full px-5 py-3 text-[15px] text-[#4A5568] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-shadow disabled:opacity-70 disabled:bg-gray-100"
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="w-12 h-12 bg-[#8FA697] rounded-full flex items-center justify-center text-white shrink-0 hover:bg-[#7D9587] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95"
          aria-label="Send message"
        >
          {isLoading ? (
            <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-0.5">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
};

MessageInput.propTypes = {
  onSend: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default MessageInput;
