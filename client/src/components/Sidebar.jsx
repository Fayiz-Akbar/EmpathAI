import { useState } from 'react';
import { LayoutDashboard, Menu, Search, Edit3, Heart, ShieldAlert, LogIn, Map, BookOpen, MapPin } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';
import { useTranslation } from 'react-i18next';
import ChatSessionItem from './ChatSessionItem';
import SettingsMenu from './SettingsMenu';
import SearchBar from './SearchBar';
import ConfirmActionModal from './ConfirmActionModal';

const Sidebar = ({ 
  isDesktopOpen, 
  onToggleDesktop, 
  chatSessions = [], 
  activeSessionId, 
  onSelectSession,
  onNewChat,
  onRenameSession, 
  onDeleteSession,
  onPinSession
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { t } = useTranslation();

  // Filter sessions based on search query
  const filteredSessions = chatSessions.filter(session => {
    const title = session.title || 'Sesi Curhat';
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const isCurrentPath = (path) => location.pathname === path;

  const handleProtectedNavigation = (path) => {
    if (user) {
      navigate(path);
    } else {
      setShowLoginPrompt(true);
    }
  };

  return (
    <aside className={`${isDesktopOpen ? 'w-[280px]' : 'w-0'} shrink-0 bg-[#F3F4F6] dark:bg-[#1e1e2e] border-r border-gray-100 dark:border-gray-700 flex flex-col transition-all duration-300 overflow-hidden h-full rounded-r-3xl`}>
      
      {/* Toggle Sidebar & Search */}
      <div className="p-4 flex items-center justify-between min-h-[64px]">
        {isSearchActive ? (
          <SearchBar 
            value={searchQuery} 
            onChange={setSearchQuery} 
            onClose={() => { setIsSearchActive(false); setSearchQuery(''); }} 
            placeholder={t('sidebar.searchHistory')} 
          />
        ) : (
          <>
            <button onClick={onToggleDesktop} className="text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-full transition-colors focus:outline-none">
              <Menu size={20} />
            </button>
            <button 
              onClick={() => setIsSearchActive(true)}
              className="text-gray-500 dark:text-gray-400 hover:bg-[#8FA697]/10 hover:text-[#5B7062] p-2 rounded-full transition-colors focus:outline-none group"
              title="Search history"
            >
              <Search size={18} className="group-hover:text-[#5B7062] transition-colors" />
            </button>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="px-4 py-2 flex flex-col gap-1">
        <button
          onClick={() => handleProtectedNavigation('/dashboard')}
          className={`w-full flex items-center gap-4 px-3 py-3 text-[15px] font-medium rounded-xl transition-colors focus:outline-none group ${
            isCurrentPath('/dashboard') 
              ? 'bg-[#8FA697]/15 dark:bg-[#8FA697]/20 text-[#5B7062] dark:text-[#A7BDAF]' 
              : 'text-gray-700 dark:text-gray-200 hover:bg-[#8FA697]/10 hover:text-[#5B7062] dark:hover:bg-[#8FA697]/20'
          }`}
        >
          <LayoutDashboard size={18} className={`${isCurrentPath('/dashboard') ? 'text-[#5B7062] dark:text-[#A7BDAF]' : 'text-gray-500 dark:text-gray-400 group-hover:text-[#5B7062]'} transition-colors`} /> {t('sidebar.dashboard')}
        </button>

        <button
          onClick={() => handleProtectedNavigation('/self-care')}
          className={`w-full flex items-center gap-4 px-3 py-3 text-[15px] font-medium rounded-xl transition-colors focus:outline-none group ${
            isCurrentPath('/self-care') 
              ? 'bg-[#8FA697]/15 dark:bg-[#8FA697]/20 text-[#5B7062] dark:text-[#A7BDAF]' 
              : 'text-gray-700 dark:text-gray-200 hover:bg-[#8FA697]/10 hover:text-[#5B7062] dark:hover:bg-[#8FA697]/20'
          }`}
        >
          <Heart size={18} className={`${isCurrentPath('/self-care') ? 'text-[#5B7062] dark:text-[#A7BDAF]' : 'text-gray-500 dark:text-gray-400 group-hover:text-[#5B7062]'} transition-colors`} /> {t('sidebar.selfCare')}
        </button>

        <button
          onClick={() => handleProtectedNavigation('/wawasan')}
          className={`w-full flex items-center gap-4 px-3 py-3 text-[15px] font-medium rounded-xl transition-colors focus:outline-none group ${
            isCurrentPath('/wawasan') 
              ? 'bg-[#8FA697]/15 dark:bg-[#8FA697]/20 text-[#5B7062] dark:text-[#A7BDAF]' 
              : 'text-gray-700 dark:text-gray-200 hover:bg-[#8FA697]/10 hover:text-[#5B7062] dark:hover:bg-[#8FA697]/20'
          }`}
        >
          <BookOpen size={18} className={`${isCurrentPath('/wawasan') ? 'text-[#5B7062] dark:text-[#A7BDAF]' : 'text-gray-500 dark:text-gray-400 group-hover:text-[#5B7062]'} transition-colors`} /> Kenapa EmpathAI?
        </button>

        <button
          onClick={() => handleProtectedNavigation('/counseling-map')}
          className={`w-full flex items-center gap-4 px-3 py-3 text-[15px] font-medium rounded-xl transition-colors focus:outline-none group ${
            isCurrentPath('/counseling-map') 
              ? 'bg-[#8FA697]/15 dark:bg-[#8FA697]/20 text-[#5B7062] dark:text-[#A7BDAF]' 
              : 'text-gray-700 dark:text-gray-200 hover:bg-[#8FA697]/10 hover:text-[#5B7062] dark:hover:bg-[#8FA697]/20'
          }`}
        >
          <MapPin size={18} className={`${isCurrentPath('/counseling-map') ? 'text-[#5B7062] dark:text-[#A7BDAF]' : 'text-gray-500 dark:text-gray-400 group-hover:text-[#5B7062]'} transition-colors`} /> Cari Konseling
        </button>

        <button 
          onClick={() => { onNewChat(); navigate('/chat'); }}
          className="w-full flex items-center gap-4 px-3 py-3 text-[15px] font-medium text-gray-700 dark:text-gray-200 rounded-xl hover:bg-[#8FA697]/10 hover:text-[#5B7062] dark:hover:bg-[#8FA697]/20 transition-colors focus:outline-none group"
        >
          <Edit3 size={18} className="text-gray-500 dark:text-gray-400 group-hover:text-[#5B7062] transition-colors" /> {t('sidebar.newChat')}
        </button>
      </div>

      {/* Chats Section */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 mt-2">
        <h3 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase px-3 mb-2">
          {t('sidebar.chats')}
        </h3>
        
        <div className="flex flex-col gap-1 pb-4">
          {filteredSessions.length === 0 ? (
            <p className="text-xs text-gray-400 italic px-3 py-2">
              {searchQuery ? t('sidebar.noChatFound') : t('sidebar.noChatHistory')}
            </p>
          ) : (
            filteredSessions.map((session) => (
              <ChatSessionItem
                key={session._id}
                session={session}
                isActive={activeSessionId === session._id}
                onSelect={() => { onSelectSession(session._id); navigate('/chat'); }}
                onRename={onRenameSession}
                onDelete={onDeleteSession}
                onPin={onPinSession}
              />
            ))
          )}
        </div>
      </div>

      {/* Settings & Help */}
      <div className="px-2 pb-2 pt-2">
        <SettingsMenu />
      </div>

      <ConfirmActionModal 
        isOpen={showLoginPrompt} 
        onClose={() => setShowLoginPrompt(false)} 
        title={t('auth.accessRestricted')}
        description={t('auth.accessRestrictedDesc')}
        icon={ShieldAlert}
        confirmText={t('auth.login')}
        confirmIcon={LogIn}
        onConfirm={() => navigate('/login')}
      />
    </aside>
  );
};

export default Sidebar;