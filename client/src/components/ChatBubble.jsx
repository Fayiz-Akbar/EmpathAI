import PropTypes from 'prop-types';

const ChatBubble = ({ isUser, text, time, isTyping }) => {
  if (isUser) {
    return (
      <div className="flex justify-end animate-fade-in mb-4">
        {/* User Bubble - Krem/Abu-abu sangat muda yang lembut, teks abu-abu gelap, rounded-2xl */}
        <div className="bg-[#F4F5F4] dark:bg-[#3a3a52] px-5 py-4 rounded-2xl max-w-[85%] lg:max-w-[70%] border border-transparent dark:border-gray-700">
          <p className="text-[15px] text-gray-800 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">{text}</p>
          {time && (
            <span className="text-[10px] text-gray-400 dark:text-gray-500 block text-right mt-2">{time}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex animate-fade-in mb-4">
      {/* AI Bubble - Plain text, no background box */}
      <div className="flex flex-col gap-1 w-full max-w-[95%] lg:max-w-[85%]">
        <div className="px-1 py-2 w-full">
          {isTyping ? (
            <div className="flex items-center gap-1.5 h-6 px-1">
              {/* Animasi titik mengetik */}
              <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          ) : (
            <>
              <p className="text-[15px] text-gray-800 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">{text}</p>
              
              {/* Metadata: Waktu */}
              <div className="flex items-center justify-start mt-2">
                {time && (
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">{time}</span>
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