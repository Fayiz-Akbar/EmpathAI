import { 
  Menu, 
  ChevronDown 
} from 'lucide-react';
import PropTypes from 'prop-types';

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
    <header className="w-full h-[64px] bg-white flex items-center justify-between shrink-0 z-20 px-4 sm:px-6">
      {/* Left: title & mobile menu */}
      <div className="flex items-center gap-2">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="p-2.5 text-[#444746] hover:bg-[#F0F4F9] rounded-full transition-colors duration-200 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        
        {/* Title / Dropdown */}
        <div className="flex items-center gap-1 px-3 py-1.5 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors group">
          <span className="text-[18px] font-medium text-[#444746] tracking-tight font-[Outfit]">EmpathAI</span>
          <ChevronDown size={16} className="text-[#444746] group-hover:text-black transition-colors" />
        </div>
      </div>

      {/* Right: User Avatar */}
      <div className="flex items-center gap-4">
        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-[#8FA697] border-2 border-white shadow-sm flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-[#7D9587] transition-all">
          {userName}
        </div>
      </div>
    </header>
  );
};

ChatHeader.propTypes = {
  onMenuClick: PropTypes.func,
};

export default ChatHeader;
