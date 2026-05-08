import { useState } from 'react';
import { LayoutDashboard, MessageSquare, ChevronDown, Plus, Settings, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // <-- 1. Import useNavigate

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
  const navigate = useNavigate(); // <-- 2. Inisialisasi navigasi

  return (
    <aside className={`${isDesktopOpen ? 'w-64' : 'w-0'} shrink-0 bg-[#f1f5f9] border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden h-full`}>
      
      {/* Header Sidebar (Persis seperti HTML: Ada ikon Hamburger) */}
      <div className="p-4 flex items-center justify-between">
        <button 
          onClick={onToggleDesktop}
          className="text-gray-500 hover:bg-gray-200 p-2 rounded-full transition-colors focus:outline-none"
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
          className="w-full flex items-center gap-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-full py-2.5 px-4 shadow-sm transition-shadow duration-200 focus:outline-none"
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
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none"
        >
          <LayoutDashboard size={18} className="text-gray-500" /> Dashboard
        </button>

        {/* Chats Dropdown Trigger */}
        <div>
          <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none"
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
                        ? 'bg-blue-100 text-blue-700 font-medium' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
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
      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center gap-3 text-gray-600 hover:text-gray-900 w-full p-2 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none">
          <Settings size={18} /> 
          <span className="text-sm font-medium">Settings & help</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;