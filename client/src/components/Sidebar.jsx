import { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, MessageSquare, ChevronDown, Plus, Settings, Menu, Pencil, Trash2, Check, X, Palette, HelpCircle, ChevronRight, Monitor, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';
import { useTheme } from '../contexts/ThemeContext';

const Sidebar = ({ 
  isDesktopOpen, 
  onToggleDesktop, 
  chatSessions = [], 
  activeSessionId, 
  onSelectSession,
  onNewChat,
  onRenameSession, 
  onDeleteSession 
}) => {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');   
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isThemeSubmenuOpen, setIsThemeSubmenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = getCurrentUser();
  const settingsRef = useRef(null);
  const { theme, setTheme } = useTheme();

  // Close settings menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
        setIsThemeSubmenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const startEditing = (e, session) => {
    e.stopPropagation(); // Mencegah klik nyasar ke select session
    setEditingId(session._id);
    setEditTitle(session.title || 'Sesi Curhat');
  };

  const submitRename = () => {
    if (editTitle.trim() !== '') {
      onRenameSession(editingId, editTitle);
    }
    setEditingId(null);
  };

  const handleThemeSelect = (selectedTheme) => {
    setTheme(selectedTheme);
    setIsSettingsOpen(false);
    setIsThemeSubmenuOpen(false);
  };

  const getThemeIcon = (themeOption) => {
    switch (themeOption) {
      case 'system': return <Monitor size={16} className="text-gray-500 dark:text-gray-400" />;
      case 'light': return <Sun size={16} className="text-amber-500" />;
      case 'dark': return <Moon size={16} className="text-indigo-500" />;
      default: return null;
    }
  };

  const getThemeLabel = (themeOption) => {
    switch (themeOption) {
      case 'system': return 'System';
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      default: return '';
    }
  };

  return (
    <aside className={`${isDesktopOpen ? 'w-64' : 'w-0'} shrink-0 bg-[#f1f5f9] dark:bg-[#1e1e2e] border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 overflow-hidden h-full`}>
      <div className="p-4 flex items-center justify-between">
        <button onClick={onToggleDesktop} className="text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-full transition-colors focus:outline-none">
          <Menu size={20} />
        </button>
      </div>

      <div className="px-4 mb-6 mt-2">
        <button 
          onClick={() => { onNewChat(); navigate('/chat'); }}
          className="w-full flex items-center gap-3 bg-white dark:bg-[#2a2a3e] hover:bg-gray-50 dark:hover:bg-[#33334a] border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-full py-2.5 px-4 shadow-sm transition-shadow duration-200 focus:outline-none"
        >
          <Plus size={18} /> <span className="font-medium text-sm">New chat</span>
        </button>
      </div>

      <nav className="flex-1 px-3 flex flex-col gap-1 overflow-y-auto no-scrollbar">
        <button onClick={() => user ? navigate('/dashboard') : navigate('/login')} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none">
          <LayoutDashboard size={18} className="text-gray-500 dark:text-gray-400" /> Dashboard
      </button>

        <div>
          <button onClick={() => setIsChatOpen(!isChatOpen)} className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none">
            <div className="flex items-center gap-3"><MessageSquare size={18} className="text-gray-500 dark:text-gray-400" /> Chats</div>
            <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isChatOpen ? 'rotate-180' : ''}`} />
          </button>

          <div className={`overflow-hidden transition-all duration-300 ${isChatOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="flex flex-col gap-1 pl-10 pr-2 pt-1 mb-2">
              
              {chatSessions.length === 0 ? (
                <p className="text-xs text-gray-400 italic px-3 py-2">No chat history yet</p>
              ) : (
                chatSessions.map((session) => (
                  <div key={session._id} className="relative group flex items-center">
                    
                    {/* MODE EDITING */}
                    {editingId === session._id ? (
                      <div className="flex items-center gap-1 w-full bg-white dark:bg-[#2a2a3e] border border-blue-400 rounded-lg px-2 py-1.5 shadow-sm">
                        <input
                          autoFocus
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && submitRename()}
                          className="w-full text-sm outline-none bg-transparent dark:text-gray-200"
                        />
                        <button onClick={submitRename} className="text-green-500 hover:text-green-700 p-1"><Check size={14} /></button>
                        <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-red-500 p-1"><X size={14} /></button>
                      </div>
                    ) : (
                      
                    /* MODE NORMAL */
                      <div className={`flex w-full items-center justify-between rounded-lg transition-colors overflow-hidden ${activeSessionId === session._id ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                        <button
                          onClick={() => { onSelectSession(session._id); navigate('/chat'); }}
                          className="truncate flex-1 text-left px-3 py-2 text-sm focus:outline-none"
                        >
                          {session.title || 'Sesi Curhat'}
                        </button>
                        
                        {/* Tombol Action Muncul Saat di-Hover */}
                        <div className="hidden group-hover:flex items-center gap-1 pr-2 shrink-0 bg-transparent">
                          <button onClick={(e) => startEditing(e, session)} className="p-1 text-gray-400 hover:text-blue-500 transition-colors">
                            <Pencil size={14} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onDeleteSession(session._id); }} 
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}

            </div>
          </div>
        </div>
      </nav>

      {/* Settings & Help Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 relative" ref={settingsRef}>
        <button 
          onClick={() => { setIsSettingsOpen(!isSettingsOpen); setIsThemeSubmenuOpen(false); }}
          className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white w-full p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none"
        >
          <Settings size={18} /> <span className="text-sm font-medium">Settings & help</span>
        </button>

        {/* Settings Popup Menu */}
        {isSettingsOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 bg-white dark:bg-[#2a2a3e] border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl py-1.5 z-50 animate-fade-in overflow-visible">
            
            {/* Theme Option with Submenu */}
            <div 
              className="relative"
              onMouseEnter={() => setIsThemeSubmenuOpen(true)}
              onMouseLeave={() => setIsThemeSubmenuOpen(false)}
            >
              <button 
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                onClick={() => setIsThemeSubmenuOpen(!isThemeSubmenuOpen)}
              >
                <div className="flex items-center gap-3">
                  <Palette size={16} className="text-gray-500 dark:text-gray-400" />
                  <span>Theme</span>
                </div>
                <ChevronRight size={14} className="text-gray-400" />
              </button>

              {/* Theme Submenu */}
              {isThemeSubmenuOpen && (
                <div className="absolute left-full top-0 ml-1 bg-white dark:bg-[#2a2a3e] border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl py-1.5 w-40 z-[60] animate-fade-in">
                  {['system', 'light', 'dark'].map((themeOption) => (
                    <button
                      key={themeOption}
                      onClick={() => handleThemeSelect(themeOption)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors text-left ${
                        theme === themeOption 
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {getThemeIcon(themeOption)}
                        <span>{getThemeLabel(themeOption)}</span>
                      </div>
                      {theme === themeOption && (
                        <Check size={14} className="text-blue-600 dark:text-blue-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Help Option */}
            <button 
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
              onClick={() => { setIsSettingsOpen(false); /* Could navigate to help page in the future */ }}
            >
              <HelpCircle size={16} className="text-gray-500 dark:text-gray-400" />
              <span>Help</span>
            </button>

          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;