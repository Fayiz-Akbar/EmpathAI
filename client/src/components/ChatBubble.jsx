import PropTypes from 'prop-types';

/**
 * ChatBubble — Renders a single chat message.
 * User messages: right-aligned, cream background.
 * AI messages: left-aligned with avatar icon, white background.
 */
const ChatBubble = ({ isUser, message, time, isTyping, emotion }) => {
  if (isUser) {
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="bg-[#E8E5DE] px-4 py-3 rounded-2xl rounded-tr-md max-w-[75%] lg:max-w-[60%]">
          <p className="text-[15px] text-[#1E293B] leading-relaxed">{message}</p>
          {time && (
            <span className="text-[10px] text-[#9CA3AF] block text-right mt-1">{time}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 max-w-[85%] lg:max-w-[70%] animate-fade-in">
      {/* AI Avatar */}
      <div className="w-8 h-8 rounded-full bg-[#8FA697] shrink-0 flex items-center justify-center text-white mt-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
          <path d="M9 13v2"/>
          <path d="M15 13v2"/>
        </svg>
      </div>

      {/* AI Message */}
      <div className="flex flex-col gap-1">
        {isTyping ? (
          <div className="flex items-center gap-1.5 h-8 px-1">
            <span className="typing-dot w-2 h-2 bg-[#9CA3AF] rounded-full" />
            <span className="typing-dot w-2 h-2 bg-[#9CA3AF] rounded-full" />
            <span className="typing-dot w-2 h-2 bg-[#9CA3AF] rounded-full" />
          </div>
        ) : (
          <>
            <p className="text-[15px] text-[#1E293B] leading-relaxed">{message}</p>
            <div className="flex items-center gap-2">
              {time && (
                <span className="text-[10px] text-[#9CA3AF]">{time}</span>
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
