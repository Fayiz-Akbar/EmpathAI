import PropTypes from 'prop-types';

/**
 * ChatHeader — Top bar of the chat page.
 * Contains menu button, "EmpathAI" title with chevron,
 * and share, options, and user avatar.
 */
const ChatHeader = ({ onMenuClick }) => {
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between z-20 shrink-0 sticky top-0">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Menu Button */}
        <button
          id="chat-menu-button"
          onClick={onMenuClick}
          className="p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-full transition-colors duration-200"
          aria-label="Open menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        
        {/* Title & Chevron */}
        <div className="flex items-center gap-1 cursor-pointer">
          <h1 className="text-[17px] font-bold text-[#4A5568] font-[Outfit] tracking-tight">
            EmpathAI
          </h1>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1">
        {/* Share Button */}
        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-full transition-colors duration-200" aria-label="Share">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>
        
        {/* Options Button */}
        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-full transition-colors duration-200" aria-label="Options">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>

        {/* User Avatar */}
        <div className="w-8 h-8 ml-1 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm cursor-pointer hover:bg-blue-600 transition-colors">
          E
        </div>
      </div>
    </header>
  );
};

ChatHeader.propTypes = {
  onMenuClick: PropTypes.func,
};

export default ChatHeader;
