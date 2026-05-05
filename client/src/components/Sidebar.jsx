import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { isAuthenticated } from '../services/authService';

/**
 * Sidebar — Gemini-style navigation panel.
 * Desktop: persistent left column (visible when isOpen or always on lg+).
 * Mobile: overlay drawer with backdrop.
 *
 * Sections: Dashboard, New Chat, Chats list.
 */
const Sidebar = ({ isOpen, onClose, chatSessions = [], onNewChat, onSelectSession, activeSessionId }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('empathAI_token');
    localStorage.removeItem('empathAI_user');
    localStorage.removeItem('empathAI_sessionId');
    navigate('/login');
  };

  const handleDashboard = () => {
    onClose();
    // Dashboard navigates to the home/chat page
    navigate('/');
  };

  const handleNewChat = () => {
    if (onNewChat) onNewChat();
    onClose();
  };

  const isDashboardActive = location.pathname === '/' || location.pathname === '/chat';

  return (
    <>
      {/* Dark Overlay — mobile only */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-[1px] z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50
          w-[280px] bg-[#F5F3EE] flex flex-col
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Top Section: Hamburger + New Chat */}
        <div className="flex items-center justify-between px-3 pt-4 pb-2 shrink-0">
          {/* Close / Hamburger Button */}
          <button
            onClick={onClose}
            className="p-2.5 text-[#5F6368] hover:bg-[#E8E5DE] rounded-full transition-colors duration-200 lg:hidden"
            aria-label="Close sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* New Chat Button (pencil-on-page icon like Gemini) */}
          <button
            onClick={handleNewChat}
            className="p-2.5 text-[#5F6368] hover:bg-[#E8E5DE] rounded-full transition-colors duration-200"
            aria-label="New chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1 px-3 py-2 shrink-0 mt-2">
          {/* Dashboard */}
          <button
            onClick={handleDashboard}
            className={`flex items-center gap-3 px-4 py-3 rounded-full text-[14.5px] font-medium transition-colors duration-200 w-full text-left ${
              isDashboardActive
                ? 'bg-[#E2DED6] text-[#1E293B]'
                : 'text-[#5F6368] hover:bg-[#E8E5DE]'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Dashboard
          </button>

          {/* New Chat */}
          <button
            onClick={handleNewChat}
            className="flex items-center gap-3 px-4 py-3 rounded-full text-[14.5px] font-medium text-[#5F6368] hover:bg-[#E8E5DE] transition-colors duration-200 w-full text-left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <line x1="12" y1="9" x2="12" y2="15" />
              <line x1="9" y1="12" x2="15" y2="12" />
            </svg>
            New chat
          </button>
        </nav>

        {/* Divider */}
        <div className="mx-4 my-2 border-t border-[#DDD9D0]" />

        {/* Chats Section */}
        <div className="px-4 pt-2 pb-1 shrink-0">
          <h3 className="text-[12px] font-semibold text-[#9CA3AF] tracking-wider uppercase">Chats</h3>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar px-2 pb-4">
          <div className="flex flex-col gap-0.5">
            {chatSessions.length > 0 ? (
              chatSessions.map((session) => (
                <button
                  key={session._id || session.id}
                  onClick={() => {
                    if (onSelectSession) onSelectSession(session._id || session.id);
                    onClose();
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-full text-[14px] text-left truncate transition-colors duration-200 w-full ${
                    activeSessionId === (session._id || session.id)
                      ? 'bg-[#E2DED6] text-[#1E293B] font-medium'
                      : 'text-[#5F6368] hover:bg-[#E8E5DE]'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span className="truncate">{session.title || 'Untitled Chat'}</span>
                </button>
              ))
            ) : (
              <p className="text-[13px] text-[#9CA3AF] px-3 py-3">No chat history yet</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-2 py-3 border-t border-[#DDD9D0] shrink-0 space-y-0.5">
          {/* Settings */}
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-full text-[14px] text-[#5F6368] hover:bg-[#E8E5DE] font-medium transition-colors duration-200 w-full text-left">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Settings & help
          </button>

          {/* Log out — only show when authenticated */}
          {isAuthenticated() && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-full text-[14px] text-red-500 hover:bg-red-50 font-medium transition-colors duration-200 w-full text-left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Log out
            </button>
          )}
        </div>
      </aside>
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
