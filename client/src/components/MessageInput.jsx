import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const MessageInput = ({ onSend, isLoading }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

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
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-end bg-gray-50 rounded-[24px] p-2 focus-within:bg-white focus-within:shadow-md focus-within:border focus-within:border-gray-200 transition-all duration-300 border border-transparent">
        
        {/* Attachment / Plus Icon */}
        <button type="button" className="p-3 text-gray-500 hover:bg-gray-200 rounded-full transition-colors mb-0.5 focus:outline-none" aria-label="Add attachment">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask EmpathAI..."
          disabled={isLoading}
          rows={1}
          className="flex-1 bg-transparent text-[16px] text-gray-800 placeholder-gray-500 focus:outline-none resize-none px-2 py-3.5 overflow-hidden leading-relaxed"
          style={{ maxHeight: '150px' }}
        />

        {/* Send / Mic Icon */}
        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className={`p-3 mb-0.5 ml-2 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 focus:outline-none ${message.trim() ? 'bg-[#8FA697] text-white hover:bg-[#7D9587] shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
          aria-label="Send message"
        >
          {isLoading ? (
            <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
          ) : message.trim() ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
          )}
        </button>

      </div>
    </form>
  );
};

MessageInput.propTypes = {
  onSend: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default MessageInput;