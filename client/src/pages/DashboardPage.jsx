import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getEmotionHistory } from '../services/chatService';
import Sidebar from '../components/Sidebar';
import ChatHeader from '../components/ChatHeader';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Sidebar State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [chatSessions] = useState([]); // Mock or fetch if needed

  useEffect(() => {
    const fetchData = async () => {
      try {
        const history = await getEmotionHistory();
        setData(history);
      } catch (error) {
        console.error("Failed to fetch emotion data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNewChat = () => {
    localStorage.removeItem('empathAI_sessionId');
    navigate('/chat');
  };

  const handleSelectSession = (sid) => {
    localStorage.setItem('empathAI_sessionId', sid);
    navigate('/chat');
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-gray-50 font-sans">
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        isDesktopOpen={isDesktopSidebarOpen}
        onToggleMobile={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onToggleDesktop={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
        chatSessions={chatSessions}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        activeSessionId=""
      />

      <div className="flex-1 flex flex-col h-full bg-white relative min-w-0">
        <ChatHeader onMenuClick={() => setIsMobileSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto no-scrollbar p-6 sm:p-10 bg-[#F0F4F9]">
          <div className="max-w-5xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl font-medium text-gray-800 mb-2 font-[Outfit]">Emotion Dashboard</h1>
              <p className="text-gray-600">Visualize your emotion trends over time based on your conversations with EmpathAI.</p>
            </div>

            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 sm:p-8">
              <h2 className="text-xl font-medium text-gray-800 mb-6 font-[Outfit]">Happiness vs Stress Over Time</h2>
              
              {isLoading ? (
                <div className="w-full h-[400px] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#8FA697]"></div>
                </div>
              ) : data.length > 0 ? (
                <div className="w-full h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dx={-10} domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '12px' }}
                        itemStyle={{ fontSize: '14px', fontWeight: '500' }}
                      />
                      <Line type="monotone" dataKey="happiness" stroke="#4b90ff" strokeWidth={4} dot={{r: 4, fill: '#4b90ff', strokeWidth: 0}} activeDot={{r: 6}} name="Happiness Score" />
                      <Line type="monotone" dataKey="stress" stroke="#ff5546" strokeWidth={4} dot={{r: 4, fill: '#ff5546', strokeWidth: 0}} activeDot={{r: 6}} name="Stress Score" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="w-full h-[400px] flex items-center justify-center text-gray-500 italic">
                  Not enough data to display analytics. Start a conversation!
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
