import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Sidebar — Full-screen drawer overlay for navigation.
 * Uses fixed positioning to overlay the entire viewport.
 */
const Sidebar = ({ isOpen, onClose, chatSessions = [], onNewChat, onSelectSession, activeSessionId }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('empathAI_token');
    localStorage.removeItem('empathAI_user');
    localStorage.removeItem('empathAI_sessionId');
    navigate('/login');
  };

  return (
    <>
      {/* Dark Overlay (click to close) */}
      <div 
        className={`fixed inset-0 bg-slate-900/30 backdrop-blur-[1px] z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer Panel */}
      <div 
        className={`fixed top-0 left-0 h-full w-[300px] max-w-[80%] bg-[#f3f4f6] z-50 shadow-2xl flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200/60 shrink-0">
          <button onClick={onClose} className="p-2 -ml-2 text-gray-500 hover:bg-gray-200 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <button className="p-2 -mr-2 text-gray-500 hover:bg-gray-200 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>

        {/* Main Menu */}
        <div className="flex flex-col gap-1 px-3 py-4 shrink-0 border-b border-gray-200/60">
          <button 
            onClick={() => {
              if (onNewChat) onNewChat();
              onClose();
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-200 text-[#4A5568] font-medium transition-colors text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <line x1="12" y1="9" x2="12" y2="15" />
              <line x1="9" y1="12" x2="15" y2="12" />
            </svg>
            New chat
          </button>
        </div>

        {/* Sub-menu CHATS */}
        <div className="px-6 py-4 shrink-0 pb-2">
          <h3 className="text-xs font-semibold text-gray-400 tracking-wider uppercase">Chats</h3>
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <div className="flex flex-col gap-1">
            {chatSessions.length > 0 ? (
              chatSessions.map((session) => (
                <button
                  key={session._id || session.id}
                  onClick={() => {
                    if (onSelectSession) onSelectSession(session._id || session.id);
                    onClose();
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-left truncate transition-colors ${
                    activeSessionId === (session._id || session.id)
                      ? 'bg-blue-50/50 text-[#4A5568]'
                      : 'hover:bg-gray-200 text-gray-500'
                  }`}
                >
                  {session.title || 'Untitled Chat'}
                </button>
              ))
            ) : (
              <p className="text-xs text-gray-400 px-3 py-2">No chat history yet</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-gray-200/60 shrink-0 space-y-1">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-200 text-[#4A5568] font-medium transition-colors w-full text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Settings & help
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-500 font-medium transition-colors w-full text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Log out
          </button>
        </div>
      </div>
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  chatSessions: PropTypes.array,
  onNewChat: PropTypes.func,
  onSelectSession: PropTypes.func,
  activeSessionId: PropTypes.string,
};

export default Sidebar;
