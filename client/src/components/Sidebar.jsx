import { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, MessageSquare, ChevronDown, ChevronRight, Plus, Menu, Sun, HelpCircle, Check, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { updateTheme, updateLocalUserTheme, getCurrentUser } from '../services/authService';

const getInitialTheme = () => {
  const user = getCurrentUser();
  if (user && user.theme) return user.theme;
  return localStorage.getItem('theme') || 'system';
};

const applyTheme = (newTheme) => {
  if (newTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (newTheme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    // System
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
};

if (typeof window !== 'undefined') {
  applyTheme(getInitialTheme());
}

// Sidebar sekarang menerima props: chatSessions (data dari backend)
const Sidebar = ({ 
  isDesktopOpen, 
  onToggleDesktop, 
  chatSessions = [], // Default array kosong
  activeSessionId, 
  onSelectSession,
  onNewChat 
}) => {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const [isThemeSubmenuOpen, setIsThemeSubmenuOpen] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const settingsMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target)) {
        setIsSettingsMenuOpen(false);
        setIsThemeSubmenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeChange = async (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    setIsThemeSubmenuOpen(false);
    
    const user = getCurrentUser();
    if (user) {
      updateLocalUserTheme(newTheme);
      try {
        await updateTheme(newTheme);
      } catch (error) {
        console.error('Gagal memperbarui tema di server:', error);
      }
    }
  };

  return (
    <aside className={`${isDesktopOpen ? 'w-64 overflow-visible' : 'w-0 overflow-hidden'} shrink-0 bg-[#f1f5f9] dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col transition-all duration-300 h-full relative z-40`}>
      
      {/* Header Sidebar (Persis seperti HTML: Ada ikon Hamburger) */}
      <div className="p-4 flex items-center justify-between">
        <button 
          onClick={onToggleDesktop}
          className="text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-800 p-2 rounded-full transition-colors focus:outline-none"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Tombol New Chat */}
      <div className="px-4 mb-6 mt-2">
        <button 
          onClick={() => {
            onNewChat();
            navigate('/chat'); // Memastikan pindah ke halaman chat saat buat chat baru
          }}
          className="w-full flex items-center gap-3 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 rounded-full py-2.5 px-4 shadow-sm transition-shadow duration-200 focus:outline-none"
        >
          <Plus size={18} />
          <span className="font-medium text-sm">New chat</span>
        </button>
      </div>

      {/* Area Menu Navigasi (Lebih rapat, gap-1, rounded-lg) */}
      <nav className="flex-1 px-3 flex flex-col gap-1 overflow-y-auto no-scrollbar">
        
        {/* Dashboard Link (Sekarang bisa dipencet) */}
        <button 
          onClick={() => navigate('/dashboard')} // <-- 3. Tambahkan fungsi onClick ke rute /dashboard
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors focus:outline-none"
        >
          <LayoutDashboard size={18} className="text-gray-500" /> Dashboard
        </button>

        {/* Chats Dropdown Trigger */}
        <div>
          <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors focus:outline-none"
          >
            <div className="flex items-center gap-3">
              <MessageSquare size={18} className="text-gray-500" /> Chats
            </div>
            <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isChatOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* List History (Dynamic Looping dari Backend) */}
          <div className={`overflow-hidden transition-all duration-300 ${isChatOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="flex flex-col gap-1 pl-10 pr-2 pt-1 mb-2">
              
              {/* Jika data dari backend KOSONG */}
              {chatSessions.length === 0 ? (
                <p className="text-xs text-gray-400 italic px-3 py-2">No chat history yet</p>
              ) : (
                /* Jika ada data dari backend, lakukan Looping */
                chatSessions.map((session) => (
                  <button
                    key={session._id}
                    onClick={() => {
                      onSelectSession(session._id);
                      navigate('/chat'); // Memastikan pindah ke chat page jika sedang di dashboard
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg truncate transition-colors focus:outline-none ${
                      activeSessionId === session._id 
                        ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-medium' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    {session.title || 'Sesi Curhat'}
                  </button>
                ))
              )}

            </div>
          </div>
        </div>
      </nav>

      {/* Footer Sidebar */}
      <div className="p-3 border-t border-gray-200 dark:border-slate-800" ref={settingsMenuRef}>
        <div className="relative">
          {/* Main Settings Button */}
          <button 
            onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors focus:outline-none ${isSettingsMenuOpen ? 'bg-gray-200 dark:bg-slate-800 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-800'}`}
          >
            <Settings size={18} className="text-gray-500 dark:text-gray-400" />
            <span>Settings & help</span>
          </button>

          {/* Settings Popover Menu */}
          {isSettingsMenuOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-[240px] bg-[#f0f4f9] dark:bg-[#1e1f22] rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-slate-800 py-3 z-50 animate-in fade-in zoom-in-95 duration-200">
              
              {/* Theme Option */}
              <div className="relative">
                <button 
                  onClick={() => setIsThemeSubmenuOpen(!isThemeSubmenuOpen)}
                  onMouseEnter={() => setIsThemeSubmenuOpen(true)}
                  className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between text-gray-700 dark:text-gray-200 hover:bg-gray-200/60 dark:hover:bg-slate-700/50 transition-colors ${isThemeSubmenuOpen ? 'bg-gray-200/60 dark:bg-slate-700/50' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <Sun size={18} className="text-gray-500" />
                    <span className="font-medium">Theme</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>

                {/* Theme Sub-menu Flyout */}
                {isThemeSubmenuOpen && (
                  <div 
                    onMouseLeave={() => setIsThemeSubmenuOpen(false)}
                    className="absolute top-0 left-full ml-1 w-48 bg-[#f0f4f9] dark:bg-[#1e1f22] rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-200"
                  >
                    <button 
                      onClick={() => handleThemeChange('system')}
                      className="w-full text-left px-4 py-3 text-sm flex items-center justify-between text-gray-700 dark:text-gray-200 hover:bg-gray-200/60 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <span className="font-medium">System</span>
                      {theme === 'system' && <Check size={16} className="text-[#4b90ff]" />}
                    </button>
                    <button 
                      onClick={() => handleThemeChange('light')}
                      className="w-full text-left px-4 py-3 text-sm flex items-center justify-between text-gray-700 dark:text-gray-200 hover:bg-gray-200/60 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <span className="font-medium">Light</span>
                      {theme === 'light' && <Check size={16} className="text-[#4b90ff]" />}
                    </button>
                    <button 
                      onClick={() => handleThemeChange('dark')}
                      className="w-full text-left px-4 py-3 text-sm flex items-center justify-between text-gray-700 dark:text-gray-200 hover:bg-gray-200/60 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <span className="font-medium">Dark</span>
                      {theme === 'dark' && <Check size={16} className="text-[#4b90ff]" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Help Option */}
              <button 
                className="w-full text-left px-4 py-3 text-sm flex items-center gap-4 text-gray-700 dark:text-gray-200 hover:bg-gray-200/60 dark:hover:bg-slate-700/50 transition-colors mt-1"
              >
                <HelpCircle size={18} className="text-gray-500" />
                <span className="font-medium">Help</span>
              </button>

            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;