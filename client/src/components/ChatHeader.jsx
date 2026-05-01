import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

/**
 * ChatHeader — Top bar of the chat page.
 * Contains back button, "EmpathAI" title with status indicator,
 * and a hamburger menu button.
 */
const ChatHeader = ({ onMenuClick }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between z-20 shrink-0">
      {/* Back Button */}
      <button
        id="chat-back-button"
        onClick={() => navigate(-1)}
        className="p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-full transition-colors duration-200"
        aria-label="Go back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Title & Status */}
      <div className="flex flex-col items-center">
        <h1 className="text-lg font-bold text-[#4A5568] font-[Outfit] tracking-tight">
          EmpathAI
        </h1>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_6px_rgba(16,185,129,0.6)] animate-pulse" />
          <span className="text-[11px] font-medium text-[#8FA697]">
            Always here for you
          </span>
        </div>
      </div>

      {/* Menu Button */}
      <button
        id="chat-menu-button"
        onClick={onMenuClick}
        className="p-2 -mr-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-full transition-colors duration-200"
        aria-label="Open menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="19" r="1" />
        </svg>
      </button>
    </header>
  );
};

ChatHeader.propTypes = {
  onMenuClick: PropTypes.func,
};

export default ChatHeader;
