import PropTypes from 'prop-types';

const ChatBubble = ({ isUser, text, time, isTyping }) => {
  if (isUser) {
    return (
      <div className="flex justify-end animate-fade-in mb-8">
        {/* User Bubble - Abu-abu yang lebih solid untuk visibilitas, teks abu-abu gelap, rounded-2xl */}
        <div className="bg-gray-200 dark:bg-[#4A4A68] shadow-sm px-5 py-4 rounded-3xl max-w-[85%] lg:max-w-[70%] border border-gray-300/50 dark:border-gray-600">
          <p className="text-[15px] font-medium text-gray-800 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">{text}</p>
          {time && (
            <span className="text-[10px] text-gray-500 dark:text-gray-400 block text-right mt-2">{time}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex animate-fade-in mb-8">
      {/* AI Bubble - Plain text, no background box, better typography */}
      <div className="flex flex-col gap-1 w-full max-w-[95%] lg:max-w-[85%]">
        <div className="px-1 py-2 w-full">
          {isTyping ? (
            <div className="flex items-center gap-1.5 h-6 px-1">
              {/* Animasi titik mengetik */}
              <span className="typing-dot w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" />
              <span className="typing-dot w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="typing-dot w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          ) : (
            <>
              <p className="text-base text-gray-800 dark:text-gray-100 leading-8 whitespace-pre-wrap tracking-wide">{text}</p>
              
              {/* Metadata: Waktu */}
              <div className="flex items-center justify-start mt-3">
                {time && (
                  <span className="text-[11px] text-gray-400 dark:text-gray-500">{time}</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

ChatBubble.propTypes = {
  isUser: PropTypes.bool.isRequired,
  text: PropTypes.string,
  time: PropTypes.string,
  isTyping: PropTypes.bool,
};

export default ChatBubble;