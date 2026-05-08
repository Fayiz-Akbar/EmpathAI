import { useState } from 'react';
import { LayoutDashboard, MessageSquare, ChevronDown, Plus, Settings } from 'lucide-react';

const Sidebar = ({ isDesktopOpen, activeSessionId, onSelectSession }) => {
  const [isChatOpen, setIsChatOpen] = useState(true);

  return (
    <aside className={`${isDesktopOpen ? 'w-66' : 'w-0'} bg-[#f1f5f9] border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden`}>
      <div className="p-4 flex items-center justify-between">
        <h2 className="font-bold text-gray-400 text-xs uppercase tracking-widest pl-2">Menu</h2>
      </div>

      <div className="px-4 mb-6">
        <button className="w-full flex items-center gap-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-full py-2.5 px-4 shadow-sm transition-all font-medium text-sm">
          <Plus size={18} /> New chat
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto no-scrollbar">
        {/* Dashboard Link */}
        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
          <LayoutDashboard size={20} className="text-gray-500" /> Dashboard
        </button>

        {/* Chats Dropdown */}
        <div>
          <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <div className="flex items-center gap-3">
              <MessageSquare size={20} className="text-gray-500" /> Chats
            </div>
            <ChevronDown size={16} className={`text-gray-400 transition-transform ${isChatOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* List History (Tampil jika isChatOpen true) */}
          <div className={`overflow-hidden transition-all duration-300 ${isChatOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="pl-10 pr-2 pt-1 space-y-1">
              {/* Contoh Data Statis, nantinya ambil dari state/props */}
              <HistoryItem title="Sesi Curhat Skripsi" active={activeSessionId === '1'} />
              <HistoryItem title="Burnout Tugas" active={false} />
            </div>
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center gap-3 text-gray-600 hover:text-gray-900 w-full p-2.5 rounded-xl hover:bg-gray-200 transition-colors">
          <Settings size={20} /> <span className="text-sm font-medium">Settings & help</span>
        </button>
      </div>
    </aside>
  );
};

const HistoryItem = ({ title, active }) => (
  <button className={`w-full text-left px-3 py-2 text-sm rounded-lg truncate transition-colors ${active ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-200'}`}>
    {title}
  </button>
);

export default Sidebar;