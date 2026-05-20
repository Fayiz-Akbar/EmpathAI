import PropTypes from 'prop-types';

const ChatBubble = ({ isUser, text, time, isTyping, emotion }) => {
  if (isUser) {
    return (
      <div className="flex justify-end animate-fade-in mb-2">
        {/* Bubble User - Sudut kanan atas lancip */}
        <div className="bg-[#E8E5DE] px-4 py-3 rounded-2xl rounded-tr-sm max-w-[75%] lg:max-w-[60%] shadow-sm">
          <p className="text-[15px] text-[#1E293B] leading-relaxed whitespace-pre-wrap">{text}</p>
          {time && (
            <span className="text-[10px] text-[#9CA3AF] block text-right mt-1.5">{time}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 max-w-[85%] lg:max-w-[75%] animate-fade-in mb-2">
      {/* AI Avatar - Diperbarui dengan gradien biru modern agar senada dengan tema aplikasi */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 shrink-0 flex items-center justify-center text-white mt-1 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
          <path d="M9 13v2"/>
          <path d="M15 13v2"/>
        </svg>
      </div>

      {/* AI Message Bubble */}
      <div className="flex flex-col gap-1 w-full">
        {/* Bubble AI - Berwarna putih dengan border tipis dan bayangan, sudut kiri atas lancip */}
        <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-tl-sm w-full">
          {isTyping ? (
            <div className="flex items-center gap-1.5 h-6 px-1">
              {/* Animasi titik mengetik yang lebih mulus */}
              <span className="typing-dot w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
              <span className="typing-dot w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="typing-dot w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          ) : (
            <>
              {/* whitespace-pre-wrap ditambahkan agar jika nanti AI mengirim teks berparagraf, formatnya tidak hancur */}
              <p className="text-[15px] text-[#1E293B] leading-relaxed whitespace-pre-wrap">{text}</p>
              
              {/* Metadata: Waktu & Emosi (Diberi garis batas tipis agar rapi) */}
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-50">
                {time && (
                  <span className="text-[10px] text-[#9CA3AF]">{time}</span>
                )}
                {emotion && emotion !== 'Netral' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 font-medium">
                    {emotion}
                  </span>
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