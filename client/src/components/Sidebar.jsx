import { useState } from 'react';
import { LayoutDashboard, MessageSquare, ChevronDown, Plus, Settings, Menu, Pencil, Trash2, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

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

  return (
    <aside className={`${isDesktopOpen ? 'w-64' : 'w-0'} shrink-0 bg-[#f1f5f9] border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden h-full`}>
      <div className="p-4 flex items-center justify-between">
        <button onClick={onToggleDesktop} className="text-gray-500 hover:bg-gray-200 p-2 rounded-full transition-colors focus:outline-none">
          <Menu size={20} />
        </button>
      </div>

      <div className="px-4 mb-6 mt-2">
        <button 
          onClick={() => { onNewChat(); navigate('/chat'); }}
          className="w-full flex items-center gap-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-full py-2.5 px-4 shadow-sm transition-shadow duration-200 focus:outline-none"
        >
          <Plus size={18} /> <span className="font-medium text-sm">New chat</span>
        </button>
      </div>

      <nav className="flex-1 px-3 flex flex-col gap-1 overflow-y-auto no-scrollbar">
        <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none">
          <LayoutDashboard size={18} className="text-gray-500" /> Dashboard
        </button>

        <div>
          <button onClick={() => setIsChatOpen(!isChatOpen)} className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none">
            <div className="flex items-center gap-3"><MessageSquare size={18} className="text-gray-500" /> Chats</div>
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
                      <div className="flex items-center gap-1 w-full bg-white border border-blue-400 rounded-lg px-2 py-1.5 shadow-sm">
                        <input
                          autoFocus
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && submitRename()}
                          className="w-full text-sm outline-none bg-transparent"
                        />
                        <button onClick={submitRename} className="text-green-500 hover:text-green-700 p-1"><Check size={14} /></button>
                        <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-red-500 p-1"><X size={14} /></button>
                      </div>
                    ) : (
                      
                    /* MODE NORMAL */
                      <div className={`flex w-full items-center justify-between rounded-lg transition-colors overflow-hidden ${activeSessionId === session._id ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-200'}`}>
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

      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center gap-3 text-gray-600 hover:text-gray-900 w-full p-2 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none">
          <Settings size={18} /> <span className="text-sm font-medium">Settings & help</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;