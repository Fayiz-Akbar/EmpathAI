import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
  Menu, 
  Plus, 
  MessageSquare, 
  Settings, 
  Search, 
  LayoutGrid,
  LogOut
} from 'lucide-react';
import { isAuthenticated } from '../services/authService';

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
    navigate('/dashboard');
  };

  const handleNewChatClick = () => {
    if (onNewChat) onNewChat();
    if (window.innerWidth < 1024) onToggleMobile();
  };

  const isDashboardActive = location.pathname === '/dashboard';

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
        {/* Top Section: Hamburger + Search */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0 h-[64px]">
          <button
            onClick={() => {
              if (window.innerWidth < 1024) {
                onToggleMobile();
              } else {
                onToggleDesktop();
              }
            }}
            className="p-2.5 text-[#444746] hover:bg-[#E1E5EA] rounded-full transition-colors duration-200"
            aria-label="Toggle sidebar"
          >
            <Menu size={22} />
          </button>
          
          {(isDesktopOpen || window.innerWidth < 1024) && (
            <button className="p-2.5 text-[#444746] hover:bg-[#E1E5EA] rounded-full transition-colors duration-200">
              <Search size={20} />
            </button>
          )}
        </div>

        {/* The Rest of the Sidebar */}
        <div className={`flex flex-col flex-1 overflow-hidden transition-opacity duration-300 ${isDesktopOpen || window.innerWidth < 1024 ? 'opacity-100' : 'opacity-0 lg:invisible'}`}>
          
          <nav className="flex flex-col gap-3 py-2 shrink-0">
            {/* New Chat Button */}
            <button
              onClick={handleNewChatClick}
              className="flex items-center gap-3 ml-[5px] p-[3px] rounded-xl text-[14px] font-medium text-[#444746] hover:bg-[#E1E5EA] transition-colors duration-200 w-[calc(100%-10px)] text-left bg-[#E1E5EA]/40"
            >
              <Plus size={18} />
              <span>New chat</span>
            </button>

            {/* Dashboard */}
            <button
              onClick={handleDashboard}
              className={`flex items-center gap-3 ml-[5px] p-[3px] rounded-xl text-[14px] font-medium transition-colors duration-200 w-[calc(100%-10px)] text-left ${
                isDashboardActive
                  ? 'bg-[#E1E5EA] text-[#1E293B]'
                  : 'text-[#444746] hover:bg-[#E1E5EA]'
              }`}
            >
              <LayoutGrid size={18} />
              <span>Dashboard</span>
            </button>
          </nav>

          {/* Sections */}
          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3">
            {/* Chats section */}
            <div className="mt-4 mb-1 px-4">
              <h3 className="text-[13px] font-semibold text-[#444746]">Chats</h3>
            </div>
            
            <div className="flex flex-col gap-2">
              {chatSessions.length > 0 ? (
                chatSessions.map((session) => (
                  <button
                    key={session._id || session.id}
                    onClick={() => {
                      if (onSelectSession) onSelectSession(session._id || session.id);
                      if (window.innerWidth < 1024) onToggleMobile();
                    }}
                    className={`flex items-center gap-3 ml-[5px] p-[3px] rounded-lg text-[14px] text-left truncate transition-colors duration-200 w-[calc(100%-10px)] ${
                      activeSessionId === (session._id || session.id)
                        ? 'bg-[#E1E5EA] text-[#1E293B] font-medium'
                        : 'text-[#444746] hover:bg-[#E1E5EA]'
                    }`}
                  >
                    <MessageSquare size={16} className="shrink-0" />
                    <span className="truncate">{session.title || 'Untitled Chat'}</span>
                  </button>
                ))
              ) : (
                <p className="text-[13px] text-[#747775] px-4 py-3 italic">No chat history yet</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="py-3 border-t border-[#E1E5EA] shrink-0 flex flex-col gap-2">
            <button className="flex items-center gap-3 ml-[5px] p-[3px] rounded-lg text-[14px] text-[#444746] hover:bg-[#E1E5EA] font-medium transition-colors duration-200 w-[calc(100%-10px)] text-left">
              <Settings size={18} />
              <span>Settings & help</span>
            </button>

            {isAuthenticated() && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 ml-[5px] p-[3px] rounded-lg text-[14px] text-red-600 hover:bg-red-50 font-medium transition-colors duration-200 w-[calc(100%-10px)] text-left"
              >
                <LogOut size={18} />
                <span>Log out</span>
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
