import { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * MessageInput — Bottom input bar for composing and sending chat messages.
 */
const MessageInput = ({ onSend, isLoading = false }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setInputValue('');
  };

  return (
    <div className="bg-[#FAF9F6] px-3 py-3 shrink-0 relative z-10 border-t border-gray-100">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        {/* Plus Button */}
        <button
          type="button"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 rounded-full transition-colors duration-200 flex-shrink-0"
          aria-label="Add attachment"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        {/* Text Input */}
        <input
          id="chat-message-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1 rounded-full bg-white border border-gray-200 px-4 py-2.5 text-[15px]
            text-[#4A5568] placeholder-gray-400
            focus:outline-none focus:border-[#8FA697] focus:ring-1 focus:ring-[#8FA697]
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200"
        />

        {/* Send Button */}
        <button
          id="chat-send-button"
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className={`
            w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
            transition-all duration-200
            ${inputValue.trim() && !isLoading
              ? 'bg-[#8FA697] hover:bg-[#7D9587] shadow-sm hover:shadow active:scale-95 text-white'
              : 'bg-[#8FA697] opacity-60 cursor-not-allowed text-white'
            }
          `}
          aria-label="Send message"
        >
          {/* Paper plane icon pointing right-up */}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="ml-0.5 mt-0.5">
            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm-3.611-1.83 4.339-2.76 7.505-7.505L3.025 8.24Z" />
          </svg>
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
