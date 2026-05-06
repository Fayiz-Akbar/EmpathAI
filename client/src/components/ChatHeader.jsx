import PropTypes from 'prop-types';

/**
 * ChatHeader — Gemini-style top bar.
 * Mobile: shows hamburger + "EmpathAI" title.
 * Desktop: shows only the right-side user avatar (sidebar is persistent).
 */
const ChatHeader = ({ onMenuClick }) => {
  const userName = (() => {
    try {
      const storedUser = localStorage.getItem('empathAI_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        return user.name ? user.name.charAt(0).toUpperCase() : 'E';
      }
    } catch {
      // fall back
    }
    return 'E';
  })();

  return (
    <header className="w-full bg-white pt-6 pb-4 px-8 sm:px-10 flex items-center justify-between shrink-0 z-20">
      {/* Left: title & mobile menu */}
      <div className="flex items-center gap-4">
        {/* Hamburger — visible only on mobile (hidden lg+) */}
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 text-[#444746] hover:bg-[#F0F4F9] rounded-full transition-colors duration-200 lg:hidden"
          aria-label="Open menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Title */}
        <h1 className="text-[22px] font-medium text-[#444746] font-[Outfit] tracking-tight">
          EmpathAI
        </h1>
      </div>

      {/* Right: User Avatar */}
      <div className="w-10 h-10 rounded-full bg-[#8FA697] flex items-center justify-center text-white font-semibold text-lg cursor-pointer hover:bg-[#7D9587] transition-colors shadow-sm">
        {userName}
      </div>
    </header>
  );
};

ChatHeader.propTypes = {
  onMenuClick: PropTypes.func,
};

export default ChatHeader;
