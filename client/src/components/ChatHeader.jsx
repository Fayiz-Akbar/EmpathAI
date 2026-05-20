import { useState, useRef, useEffect } from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Tambahkan isDesktopSidebarOpen ke dalam parameter props
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
    // 1. Sapu bersih SEMUA data di penyimpanan lokal browser.
    localStorage.clear();

    // 2. Langsung lempar ke /chat dan refresh secara hard-reload
    // Ini memastikan state React benar-benar bersih dan Sidebar tidak error
    window.location.href = '/chat'; 
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white border-b border-gray-100 shrink-0">
      <div className="flex items-center gap-2">
        {/* Logika Hamburger */}
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
          // Wrapper untuk Dropdown
          <div className="relative" ref={dropdownRef}>
            {/* Tombol Avatar Profil */}
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-medium text-sm shadow-sm hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-teal-500"
            >
              {user.name ? user.name.charAt(0).toUpperCase() : 'E'}
            </button>

            {/* Menu Dropdown Logout */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50 animate-fade-in">
                <div className="px-4 py-2 border-b border-gray-50 mb-1">
                  <p className="text-sm font-medium text-gray-800 truncate">{user.name || 'User'}</p>
                  <p className="text-[11px] text-gray-400 truncate">{user.email || ''}</p>
                </div>
                
                <button 
                  onClick={handleLogout} 
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut size={16} /> 
                  <span>Keluar Akun</span>
                </button>
              </div>
            )}
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