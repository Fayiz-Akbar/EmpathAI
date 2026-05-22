import PropTypes from 'prop-types';

const ChatBubble = ({ isUser, text, time, isTyping, emotion }) => {
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
      {/* AI Bubble - Background putih murni, bayangan sangat halus, border transparan/tipis, rounded-2xl */}
      <div className="flex flex-col gap-1 w-full max-w-[85%] lg:max-w-[70%]">
        <div className="bg-white dark:bg-[#2a2a3e] border border-gray-50 dark:border-gray-700 shadow-sm px-5 py-5 rounded-2xl w-full">
          {isTyping ? (
            <div className="flex items-center gap-1.5 h-6 px-1">
              {/* Animasi titik mengetik */}
              <span className="typing-dot w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
              <span className="typing-dot w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="typing-dot w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          ) : (
            <>
              <p className="text-[15px] text-gray-800 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">{text}</p>
              
              {/* Metadata: Waktu & Emosi */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50 dark:border-gray-700/50">
                {emotion && emotion !== 'Netral' ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 font-medium">
                    {emotion}
                  </span>
                ) : (
                  <span /> /* Spacer if no emotion */
                )}
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
  emotion: PropTypes.string,
};

export default ChatBubble;