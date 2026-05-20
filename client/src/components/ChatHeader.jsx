import { Menu, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Tambahkan isDesktopSidebarOpen ke dalam parameter props
const ChatHeader = ({ user, onMenuClick, isDesktopSidebarOpen }) => {
  const navigate = useNavigate();

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white border-b border-gray-100 shrink-0">
      <div className="flex items-center gap-2">
        {/* Logika Hamburger: Jika sidebar desktop sedang terbuka, sembunyikan ikon ini di desktop (md:hidden). Jika tertutup, munculkan. */}
        <button 
          onClick={onMenuClick} 
          className={`text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-colors ${isDesktopSidebarOpen ? 'md:hidden' : ''}`}
        >
          <Menu size={20} />
        </button>
        
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors">
          <span className="font-semibold text-xl text-gray-700 font-[Outfit]">EmpathAI</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-medium text-sm cursor-pointer shadow-sm hover:opacity-90 transition-opacity">
            {user.name ? user.name.charAt(0).toUpperCase() : 'E'}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/login')} 
              className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-full transition-all"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/register')} 
              className="px-4 py-1.5 text-sm font-medium text-white bg-[#4b90ff] hover:bg-blue-600 rounded-full transition-all shadow-sm"
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