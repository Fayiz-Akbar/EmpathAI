import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, MessageSquare, Flame, Calendar, ArrowRight, Brain } from 'lucide-react';
// IMPORT BARU: Komponen dari Recharts
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Sidebar from '../components/Sidebar';
import ChatHeader from '../components/ChatHeader';
import { getCurrentUser } from '../services/authService';
import { getUserSessions, renameSession, deleteSession } from '../services/chatService';

// --- DATA SIMULASI UNTUK GRAFIK (Nanti kita ganti dari database) ---
const mockEmotionData = [
  { day: 'Sen', Senang: 60, Stres: 40, Sedih: 10, Marah: 5 },
  { day: 'Sel', Senang: 50, Stres: 60, Sedih: 20, Marah: 10 },
  { day: 'Rab', Senang: 40, Stres: 80, Sedih: 30, Marah: 15 },
  { day: 'Kam', Senang: 70, Stres: 50, Sedih: 10, Marah: 5 },
  { day: 'Jum', Senang: 85, Stres: 30, Sedih: 5, Marah: 0 },
  { day: 'Sab', Senang: 90, Stres: 20, Sedih: 0, Marah: 0 },
  { day: 'Min', Senang: 80, Stres: 25, Sedih: 10, Marah: 5 },
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [chatSessions, setChatSessions] = useState([]);

  // Load data sesi dari backend
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const currentUserId = user ? (user._id || user.id) : null;
        if (currentUserId) {
          const res = await getUserSessions(currentUserId);
          if (res.data) {
            setChatSessions(res.data);
          }
        }
      } catch (error) {
        console.error("Gagal memuat daftar sesi:", error);
      }
    };
    loadSessions();
  }, [user]);

  // Handler untuk Sidebar
  const handleNewChat = () => {
    localStorage.removeItem('empathAI_sessionId');
    navigate('/chat');
  };

  const handleSelectSession = (id) => {
    localStorage.setItem('empathAI_sessionId', id);
    navigate('/chat');
  };

  const handleRenameSession = async (id, newTitle) => {
    try {
      await renameSession(id, newTitle);
      setChatSessions(prev => prev.map(s => s._id === id ? { ...s, title: newTitle } : s));
    } catch (error) {
      console.error("Gagal mengubah nama sesi:", error);
    }
  };

  const handleDeleteSession = async (id) => {
    if (!window.confirm("Yakin ingin menghapus riwayat obrolan ini?")) return;
    try {
      await deleteSession(id);
      setChatSessions(prev => prev.filter(s => s._id !== id));
    } catch (error) {
      console.error("Gagal menghapus sesi:", error);
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-slate-50 font-sans text-gray-800 relative">
      {/* Overlay Mobile */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 md:static md:block
        transform transition-transform duration-300 ease-in-out h-full
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar 
          isDesktopOpen={isDesktopSidebarOpen} 
          onToggleDesktop={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
          chatSessions={chatSessions}
          activeSessionId={null} 
          onSelectSession={handleSelectSession}
          onNewChat={handleNewChat}
          onRenameSession={handleRenameSession}
          onDeleteSession={handleDeleteSession}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full bg-white relative min-w-0">
        <ChatHeader 
          user={user} 
          isDesktopSidebarOpen={isDesktopSidebarOpen}
          onMenuClick={() => {
            setIsMobileSidebarOpen(true);
            setIsDesktopSidebarOpen(!isDesktopSidebarOpen);
          }} 
        />

        <main className="flex-1 overflow-y-auto no-scrollbar p-6 lg:p-10">
          <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
            
            {/* Header Dashboard */}
            <div>
              <h1 className="text-3xl font-semibold text-gray-800 font-[Outfit]">
                Welcome back, {user?.name?.split(' ')[0] || 'Guest'}
              </h1>
              <p className="text-gray-500 mt-1">Here is a summary of your emotional journey.</p>
            </div>

            {/* Highlight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard 
                icon={<MessageSquare className="text-blue-500" size={24} />}
                title="Total Sessions"
                value={chatSessions.length}
                subtitle="Conversations so far"
                bgColor="bg-blue-50"
              />
              <StatCard 
                icon={<Flame className="text-orange-500" size={24} />}
                title="Current Streak"
                value="3 Days"
                subtitle="Keep it up!"
                bgColor="bg-orange-50"
              />
              <StatCard 
                icon={<Brain className="text-purple-500" size={24} />}
                title="Dominant Mood"
                value="Netral" 
                subtitle="In the last 7 days"
                bgColor="bg-purple-50"
              />
            </div>

            {/* Layout 2 Kolom */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Kolom Grafik Emosi */}
              <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Activity size={20} className="text-blue-500"/> Mood Analytics
                  </h2>
                </div>
                
                {/* GRAFIK RECHARTS */}
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockEmotionData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        cursor={{ stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '3 3' }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Line type="monotone" dataKey="Senang" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Stres" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                      <Line type="monotone" dataKey="Sedih" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                      <Line type="monotone" dataKey="Marah" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Kolom Recent Chats */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Calendar size={20} className="text-blue-500"/> Recent Chats
                  </h2>
                </div>

                <div className="flex flex-col gap-3 flex-1">
                  {chatSessions.length === 0 ? (
                    <p className="text-gray-400 text-sm italic text-center mt-10">Belum ada obrolan.</p>
                  ) : (
                    chatSessions.slice(0, 4).map(session => (
                      <button 
                        key={session._id}
                        onClick={() => handleSelectSession(session._id)}
                        className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all text-left group"
                      >
                        <div className="overflow-hidden">
                          <p className="text-sm font-medium text-gray-700 truncate">{session.title || 'Sesi Curhat'}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {new Date(session.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                        <ArrowRight size={16} className="text-gray-300 group-hover:text-blue-500 transition-colors shrink-0" />
                      </button>
                    ))
                  )}
                </div>

                <button 
                  onClick={handleNewChat}
                  className="w-full mt-4 py-2.5 bg-[#1E293B] hover:bg-black text-white text-sm font-medium rounded-xl transition-colors"
                >
                  Mulai Sesi Baru
                </button>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, subtitle, bgColor }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-start gap-4">
    <div className={`p-3 rounded-xl ${bgColor}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800 mt-1 font-[Outfit]">{value}</h3>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </div>
  </div>
);

export default DashboardPage;