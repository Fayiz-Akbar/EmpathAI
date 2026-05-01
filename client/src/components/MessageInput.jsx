import { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * MessageInput — Bottom input bar for composing and sending chat messages.
 * Contains a text field, attachment button, and send button.
 *
 * @prop {function} onSend       — Callback with the message string when user sends.
 * @prop {boolean}  isLoading    — If true, disables the input while waiting for a response.
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

  const canSend = inputValue.trim().length > 0 && !isLoading;

  return (
    <div className="bg-white/95 backdrop-blur-sm px-3 py-3 border-t border-gray-100 shrink-0">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        {/* Attachment Button */}
        <button
          type="button"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors duration-200 flex-shrink-0"
          aria-label="Attach file"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          placeholder={isLoading ? 'Waiting for reply...' : 'Type your message...'}
          disabled={isLoading}
          className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm
            text-[#4A5568] placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-[#8FA697]/30 focus:border-[#8FA697] focus:bg-white
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200"
        />

        {/* Send Button */}
        <button
          id="chat-send-button"
          type="submit"
          disabled={!canSend}
          className={`
            w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
            transition-all duration-200
            ${canSend
              ? 'bg-[#8FA697] hover:bg-[#7a8f81] shadow-md hover:shadow-lg active:scale-95'
              : 'bg-gray-200 cursor-not-allowed'
            }
          `}
          aria-label="Send message"
        >
          {isLoading ? (
            <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
