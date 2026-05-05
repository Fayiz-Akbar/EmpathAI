import PropTypes from 'prop-types';

/**
 * ChatBubble — Renders a single chat message bubble or typing indicator.
 *
 * @prop {boolean} isUser     — If true, renders as user bubble (right-aligned).
 * @prop {string}  message    — The message text to display.
 * @prop {string}  time       — Formatted timestamp string.
 * @prop {boolean} isTyping   — If true, renders typing dots instead of text.
 * @prop {string}  emotion    — Detected emotion label (optional, AI only).
 */
const ChatBubble = ({ isUser, message, time, isTyping, emotion }) => {
  if (isUser) {
    // ── User Bubble (Right Side) ──
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="bg-blue-50/50 px-4 py-3 rounded-2xl rounded-tr-lg max-w-[75%] lg:max-w-[60%] flex flex-col gap-1">
          <p className="text-[15px] text-[#4A5568] leading-relaxed">
            {message}
          </p>
          {time && (
            <span className="text-[10px] text-gray-400 self-end mt-0.5">
              {time}
            </span>
          )}
        </div>
      </div>
    );
  }

  // ── AI Bubble (Left Side) ──
  return (
    <div className="flex gap-2.5 max-w-[85%] lg:max-w-[70%] animate-fade-in">
      {/* AI Avatar */}
      <div className="w-8 h-8 rounded-full bg-[#8FA697] flex-shrink-0 flex items-center justify-center text-white mt-auto shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
          <path d="M9 13v2"/>
          <path d="M15 13v2"/>
        </svg>
      </div>

      {/* AI Message / Typing Indicator */}
      <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-lg shadow-sm flex flex-col gap-1 items-start justify-center border border-stone-100">
        {isTyping ? (
          <div className="flex items-center gap-1.5 h-6">
            <span className="typing-dot w-2 h-2 bg-gray-300 rounded-full" />
            <span className="typing-dot w-2 h-2 bg-gray-300 rounded-full" />
            <span className="typing-dot w-2 h-2 bg-gray-300 rounded-full" />
          </div>
        ) : (
          <>
            <p className="text-[15px] text-[#4A5568] leading-relaxed">
              {message}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              {time && (
                <span className="text-[10px] text-gray-400">
                  {time}
                </span>
              )}
              {emotion && emotion !== 'Netral' && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E8F0EB] text-[#8FA697] font-medium">
                  {emotion}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

ChatBubble.propTypes = {
  isUser: PropTypes.bool.isRequired,
  message: PropTypes.string,
  time: PropTypes.string,
  isTyping: PropTypes.bool,
  emotion: PropTypes.string,
};

export default ChatBubble;
