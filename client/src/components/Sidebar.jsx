import PropTypes from 'prop-types';

/**
 * Sidebar — Slide-out navigation drawer.
 */
const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/20 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      />
      
      {/* Sidebar Drawer */}
      <div 
        className={`absolute inset-y-0 left-0 w-[280px] bg-white z-50 shadow-xl transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 shrink-0">
          <button onClick={onClose} className="p-2 -ml-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <button className="p-2 -mr-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>

        {/* Main Menu */}
        <div className="flex flex-col gap-1 px-3 py-4 shrink-0 border-b border-gray-100">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-[#4A5568] font-medium transition-colors text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="9" rx="1" />
              <rect x="14" y="3" width="7" height="5" rx="1" />
              <rect x="14" y="12" width="7" height="9" rx="1" />
              <rect x="3" y="16" width="7" height="5" rx="1" />
            </svg>
            Dashboard
          </button>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-[#4A5568] font-medium transition-colors text-sm">
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
          <h3 className="text-xs font-semibold text-gray-400 tracking-wider">CHATS</h3>
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <div className="flex flex-col gap-1">
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-50/50 text-[#4A5568] font-medium text-sm text-left line-clamp-1 truncate">
              Mengatasi stres kerja
            </button>
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-500 font-medium text-sm text-left line-clamp-1 truncate transition-colors">
              Sesi relaksasi mingguan
            </button>
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-500 font-medium text-sm text-left line-clamp-1 truncate transition-colors">
              Jadwal tidur yang lebih baik
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-gray-100 shrink-0">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-[#4A5568] font-medium transition-colors w-full text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Settings & help
          </button>
        </div>
      </div>
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Sidebar;
