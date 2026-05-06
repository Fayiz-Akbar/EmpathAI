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
const Sidebar = ({ 
  isMobileOpen, 
  isDesktopOpen, 
  onToggleMobile, 
  onToggleDesktop, 
  chatSessions = [], 
  onNewChat, 
  onSelectSession, 
  activeSessionId 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('empathAI_token');
    localStorage.removeItem('empathAI_user');
    localStorage.removeItem('empathAI_sessionId');
    navigate('/login');
  };

  const handleDashboard = () => {
    if (window.innerWidth < 1024) onToggleMobile();
    navigate('/');
  };

  const handleNewChatClick = () => {
    if (onNewChat) onNewChat();
    if (window.innerWidth < 1024) onToggleMobile();
  };

  const isDashboardActive = location.pathname === '/' || location.pathname === '/chat';

  return (
    <>
      {/* Dark Overlay — mobile only */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isMobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
        onClick={onToggleMobile}
      />

      {/* Sidebar Panel */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 bg-[#F0F4F9] flex flex-col
          transition-all duration-300 ease-in-out overflow-hidden
          lg:static lg:z-auto
          ${isMobileOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full w-[280px]'}
          lg:translate-x-0
          ${isDesktopOpen ? 'lg:w-[280px]' : 'lg:w-[72px]'}
        `}
      >
        {/* Top Section: Hamburger + New Chat */}
        <div className="flex items-center px-6 pt-6 pb-4 shrink-0 h-[80px]">
          {/* Hamburger Button */}
          <button
            onClick={() => {
              if (window.innerWidth < 1024) {
                onToggleMobile();
              } else {
                onToggleDesktop();
              }
            }}
            className="p-3 -ml-2 text-[#444746] hover:bg-[#E1E5EA] rounded-full transition-colors duration-200 shrink-0"
            aria-label="Toggle sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        {/* The Rest of the Sidebar (Hidden when collapsed on desktop) */}
        <div className={`flex flex-col flex-1 overflow-hidden transition-opacity duration-300 ${isDesktopOpen || window.innerWidth < 1024 ? 'opacity-100' : 'opacity-0 lg:invisible'}`}>
          
          {/* Navigation Items */}
          <nav className="flex flex-col gap-2 px-5 py-2 shrink-0">
            {/* Dashboard */}
            <button
              onClick={handleDashboard}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-full text-[15px] font-medium transition-colors duration-200 w-full text-left ${
                isDashboardActive
                  ? 'bg-[#E1E5EA] text-[#1E293B]'
                  : 'text-[#444746] hover:bg-[#E1E5EA]'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              Dashboard
            </button>

            {/* New Chat */}
            <button
              onClick={handleNewChatClick}
              className="flex items-center gap-4 px-4 py-3.5 rounded-full text-[15px] font-medium text-[#444746] hover:bg-[#E1E5EA] transition-colors duration-200 w-full text-left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <line x1="12" y1="9" x2="12" y2="15" />
                <line x1="9" y1="12" x2="15" y2="12" />
              </svg>
              New chat
            </button>
          </nav>

          {/* Divider */}
          <div className="mx-8 my-3 border-t border-[#E1E5EA]" />

          {/* Chats Section */}
          <div className="px-8 pt-3 pb-2 shrink-0">
            <h3 className="text-[13px] font-semibold text-[#444746] tracking-wider uppercase">Chats</h3>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-4">
            <div className="flex flex-col gap-1.5">
              {chatSessions.length > 0 ? (
                chatSessions.map((session) => (
                  <button
                    key={session._id || session.id}
                    onClick={() => {
                      if (onSelectSession) onSelectSession(session._id || session.id);
                      if (window.innerWidth < 1024) onToggleMobile();
                    }}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-full text-[15px] text-left truncate transition-colors duration-200 w-full ${
                      activeSessionId === (session._id || session.id)
                        ? 'bg-[#E1E5EA] text-[#1E293B] font-medium'
                        : 'text-[#444746] hover:bg-[#E1E5EA]'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span className="truncate">{session.title || 'Untitled Chat'}</span>
                  </button>
                ))
              ) : (
                <p className="text-[14px] text-[#747775] px-4 py-4">No chat history yet</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-5 border-t border-[#E1E5EA] shrink-0 space-y-1.5">
            {/* Settings */}
            <button className="flex items-center gap-4 px-4 py-3.5 rounded-full text-[15px] text-[#444746] hover:bg-[#E1E5EA] font-medium transition-colors duration-200 w-full text-left">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              Settings & help
            </button>

            {/* Log out — only show when authenticated */}
            {isAuthenticated() && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-4 px-4 py-3.5 rounded-full text-[15px] text-red-600 hover:bg-red-50 font-medium transition-colors duration-200 w-full text-left"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Log out
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

Sidebar.propTypes = {
  isMobileOpen: PropTypes.bool.isRequired,
  isDesktopOpen: PropTypes.bool.isRequired,
  onToggleMobile: PropTypes.func.isRequired,
  onToggleDesktop: PropTypes.func.isRequired,
  chatSessions: PropTypes.array,
  onNewChat: PropTypes.func,
  onSelectSession: PropTypes.func,
  activeSessionId: PropTypes.string,
};

export default Sidebar;
