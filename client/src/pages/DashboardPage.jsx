import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, MessageSquare, Flame, Calendar, ArrowRight, Brain } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Sidebar from '../components/Sidebar';
import ChatHeader from '../components/ChatHeader';
import { getCurrentUser } from '../services/authService';
import { getUserSessions, getHistory, renameSession, deleteSession } from '../services/chatService';

// Fungsi Helper: Membuat array dinamis berisi 7 hari terakhir
const getLast7Days = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      dateStr: d.toDateString(),
      day: d.toLocaleDateString('id-ID', { weekday: 'short' }),
      Senang: 0, Stres: 0, Sedih: 0, Marah: 0
    });
  }
  return days;
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  
  // PERBAIKAN INFINITE LOOP: Ekstrak ID dalam bentuk teks/string yang statis
  const userId = user ? (user._id || user.id) : null;
  
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  
  // State untuk Data Dinamis
  const [chatSessions, setChatSessions] = useState([]);
  const [emotionData, setEmotionData] = useState([]);
  const [dominantMood, setDominantMood] = useState("Menunggu Data...");
  const [streakCount, setStreakCount] = useState(0);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Tendang kembali ke halaman login jika tidak ada user
  useEffect(() => {
    if (!userId) navigate('/login');
  }, [userId, navigate]); // Bergantung pada userId (teks statis), bukan object user

  // Load Data Sesi & Analisis Seluruh Pesan
  useEffect(() => {
    const fetchAndAnalyzeData = async () => {
      if (!userId) return;
      setIsLoadingData(true);

      try {
        const sessionRes = await getUserSessions(userId);
        const sessions = sessionRes.data || [];
        setChatSessions(sessions);

        let allMessages = [];
        // Ambil 5 sesi terakhir untuk dianalisis
        const recentSessionsToAnalyze = sessions.slice(0, 5);
        
        for (const session of recentSessionsToAnalyze) {
          const historyRes = await getHistory(session._id);
          if (historyRes.data) {
             allMessages = [...allMessages, ...historyRes.data];
          }
        }

        processAnalytics(allMessages, sessions);

      } catch (error) {
        console.error("Gagal memuat atau menganalisis data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchAndAnalyzeData();
  }, [userId]); // PERBAIKAN UTAMA: Dependency diubah menjadi userId agar tidak kelap-kelip


  const processAnalytics = (messages, sessions) => {
    // 1. Hitung Total Sesi sebagai "Streak" sementara
    setStreakCount(sessions.length);

    if (!messages || messages.length === 0) {
      setDominantMood("Belum Ada Data");
      setEmotionData(getLast7Days());
      return;
    }

    // 2. Hitung Emosi Dominan (Abaikan Netral)
    const emotionCounts = { Senang: 0, Sedih: 0, Marah: 0, Stres: 0 };
    messages.forEach(msg => {
      if (msg.emotion) {
        const em = msg.emotion.charAt(0).toUpperCase() + msg.emotion.slice(1);
        if (emotionCounts[em] !== undefined) {
          emotionCounts[em]++;
        }
      }
    });

    let maxEmotion = 'Netral';
    let maxCount = 0;
    Object.entries(emotionCounts).forEach(([em, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxEmotion = em;
      }
    });
    setDominantMood(maxCount > 0 ? maxEmotion : 'Belum Ada Pola');

    // 3. Masukkan Data ke Grafik 7 Hari Terakhir
    const weekData = getLast7Days();

    messages.forEach(msg => {
      const msgDate = new Date(msg.timestamp).toDateString();
      if (msg.emotion) {
        const em = msg.emotion.charAt(0).toUpperCase() + msg.emotion.slice(1);
        const dayIndex = weekData.findIndex(d => d.dateStr === msgDate);
        
        if (dayIndex !== -1 && weekData[dayIndex][em] !== undefined) {
          weekData[dayIndex][em] += 1; 
        }
      }
    });

    setEmotionData(weekData);
  };

  // Handler Sidebar
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
      // Refresh layar untuk menghitung ulang grafik setelah chat dihapus
      window.location.reload(); 
    } catch (error) {
      console.error("Gagal menghapus sesi:", error);
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-slate-50 font-sans text-gray-800 relative">
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

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
                value={`${streakCount} Days`}
                subtitle={streakCount > 0 ? "Keep it up!" : "Mulai curhat hari ini!"}
                bgColor="bg-orange-50"
              />
              <StatCard 
                icon={<Brain className="text-purple-500" size={24} />}
                title="Dominant Mood"
                value={isLoadingData ? "Menghitung..." : dominantMood}
                subtitle="Based on your recent chats"
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
                
                {/* GRAFIK BATANG RECHARTS */}
                <div className="h-64 w-full relative">
                  {isLoadingData ? (
                     <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 rounded-xl">
                        <span className="text-sm font-medium text-blue-500 animate-pulse">Menganalisis emosi...</span>
                     </div>
                  ) : null}

                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={emotionData.length > 0 ? emotionData : getLast7Days()} margin={{ top: 10, right: 10, bottom: 5, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                      <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        cursor={{ fill: '#f8fafc' }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Bar dataKey="Senang" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                      <Bar dataKey="Stres" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={40} />
                      <Bar dataKey="Sedih" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} />
                      <Bar dataKey="Marah" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
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