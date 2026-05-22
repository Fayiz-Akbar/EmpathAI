import { useState } from 'react';
import { LayoutDashboard, MessageSquare, ChevronDown, Plus, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';
import ChatSessionItem from './ChatSessionItem';
import SettingsMenu from './SettingsMenu';

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
  const navigate = useNavigate();
  const user = getCurrentUser();

  return (
    <aside className={`${isDesktopOpen ? 'w-64' : 'w-0'} shrink-0 bg-[#f1f5f9] dark:bg-[#1e1e2e] border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 overflow-hidden h-full`}>
      
      {/* Toggle Sidebar */}
      <div className="p-4 flex items-center justify-between">
        <button onClick={onToggleDesktop} className="text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-full transition-colors focus:outline-none">
          <Menu size={20} />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="px-4 mb-6 mt-2">
        <button 
          onClick={() => { onNewChat(); navigate('/chat'); }}
          className="w-full flex items-center gap-3 bg-white dark:bg-[#2a2a3e] hover:bg-gray-50 dark:hover:bg-[#33334a] border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-full py-2.5 px-4 shadow-sm transition-shadow duration-200 focus:outline-none"
        >
          <Plus size={18} /> <span className="font-medium text-sm">New chat</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 flex flex-col gap-1 overflow-y-auto no-scrollbar">
        
        {/* Dashboard Link */}
        <button
          onClick={() => user ? navigate('/dashboard') : navigate('/login')}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none"
        >
          <LayoutDashboard size={18} className="text-gray-500 dark:text-gray-400" /> Dashboard
        </button>

        {/* Chats Accordion */}
        <div>
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none"
          >
            <div className="flex items-center gap-3">
              <MessageSquare size={18} className="text-gray-500 dark:text-gray-400" /> Chats
            </div>
            <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isChatOpen ? 'rotate-180' : ''}`} />
          </button>

          <div className={`overflow-hidden transition-all duration-300 ${isChatOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="flex flex-col gap-1 pl-10 pr-2 pt-1 mb-2">
              {chatSessions.length === 0 ? (
                <p className="text-xs text-gray-400 italic px-3 py-2">No chat history yet</p>
              ) : (
                chatSessions.map((session) => (
                  <ChatSessionItem
                    key={session._id}
                    session={session}
                    isActive={activeSessionId === session._id}
                    onSelect={() => { onSelectSession(session._id); navigate('/chat'); }}
                    onRename={onRenameSession}
                    onDelete={onDeleteSession}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Settings & Help */}
      <SettingsMenu />
    </aside>
  );
};

export default Sidebar;