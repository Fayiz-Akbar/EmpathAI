import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Plus, Mic, Send, Loader2 } from 'lucide-react';

const MessageInput = ({ onSend, isLoading, isCentered = false }) => {
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
    if (e) e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message);
      setMessage('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={`w-full shrink-0 ${isCentered ? '' : 'bg-white pb-4 pt-2'}`}>
      <div className={`w-full ${isCentered ? 'max-w-[800px]' : 'max-w-4xl'} mx-auto px-4 sm:px-8`}>
        <div className={`
          flex flex-col bg-[#F0F4F9] rounded-[28px] p-2 transition-all duration-300 border border-transparent
          ${isCentered ? 'min-h-[140px] shadow-sm' : 'focus-within:bg-white focus-within:shadow-md focus-within:border-[#E0E0E0]'}
        `}>
          {/* Text Area */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask EmpathAI"
            disabled={isLoading}
            rows={1}
            className="w-full flex-1 bg-transparent text-[16px] text-[#1E293B] placeholder-[#444746] focus:outline-none focus:ring-0 border-0 resize-none px-4 py-3 overflow-hidden leading-relaxed disabled:opacity-70"
            style={{ maxHeight: '150px' }}
          />

          {/* Bottom Controls Row */}
          <div className="flex items-center justify-between px-2 pb-1 mt-auto">
            {/* Left Controls */}
            <div className="flex items-center gap-1">
              <button type="button" className="p-2.5 text-[#444746] hover:bg-black/5 rounded-full transition-colors" aria-label="Add attachment">
                <Plus size={20} />
              </button>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleSubmit}
                disabled={!message.trim() && !isLoading}
                className={`p-2.5 rounded-full flex items-center justify-center transition-all duration-200 ${message.trim() ? 'bg-black text-white shadow-sm' : 'text-[#444746] hover:bg-black/5'}`}
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : message.trim() ? (
                  <Send size={20} />
                ) : (
                  <Mic size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

MessageInput.propTypes = {
  onSend: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isCentered: PropTypes.bool,
};

export default MessageInput;