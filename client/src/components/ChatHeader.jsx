import { useState, useRef, useEffect } from 'react';
import { Menu, LogOut, ChevronDown, Share, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatHeader = ({ user, onMenuClick, isDesktopSidebarOpen }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Efek untuk menutup dropdown jika pengguna mengklik area di luar menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/chat'; 
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-[#FAF9F6] dark:bg-[#1a1a2e] border-b border-gray-100 dark:border-gray-700 shrink-0">
      
      {/* Left side: Hamburger and Title */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick} 
          className={`text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-colors ${isDesktopSidebarOpen ? 'md:hidden' : ''}`}
        >
          <Menu size={20} />
        </button>
        
        <div className="flex items-center gap-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 px-2 py-1 rounded-lg transition-colors">
          <span className="font-bold text-lg text-gray-800 dark:text-gray-100 font-[Outfit]">EmpathAI</span>
          <ChevronDown size={16} className="text-gray-400 mt-0.5" />
        </div>
      </div>

      {/* Right side: Actions and Profile */}
      <div className="flex items-center gap-2 sm:gap-4">


        {user ? (
          <div className="relative ml-2" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium text-sm shadow-sm hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
            >
              {user.name ? user.name.charAt(0).toUpperCase() : 'E'}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#2a2a3e] border border-gray-100 dark:border-gray-600 rounded-xl shadow-lg py-1 z-50 animate-fade-in">
                <div className="px-4 py-2 border-b border-gray-50 dark:border-gray-600 mb-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{user.name || 'User'}</p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">{user.email || ''}</p>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                >
                  <LogOut size={16} /> 
                  <span>Keluar Akun</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 ml-2">
            <button 
              onClick={() => navigate('/login')} 
              className="px-4 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/register')} 
              className="px-4 py-1.5 text-sm font-medium text-white bg-[#8FA697] hover:bg-[#7A9182] rounded-full transition-all shadow-sm"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default ChatHeader;