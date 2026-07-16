import { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Map, ShieldAlert, LogIn, Activity, FileText, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getCurrentUser } from '../services/authService';
import Sidebar from '../components/Sidebar';
import ChatHeader from '../components/ChatHeader';
import ConfirmActionModal from '../components/ConfirmActionModal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

import bpsHappinessData from '../data/bps_happiness_data.json';

const chartData = [...bpsHappinessData].sort((a, b) => b.index - a.index);

const getStatusColor = (status) => {
  return status === 'Tertinggi' ? '#059669' : '#dc2626'; // Standard green and red
};

const GeoMapPage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const { t } = useTranslation();
  
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleMenuClick = () => {
    setIsMobileSidebarOpen(true);
    setIsDesktopSidebarOpen(!isDesktopSidebarOpen);
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-gray-50 font-sans text-gray-800 relative">
      
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-50 md:static md:block
        transform transition-transform duration-300 ease-in-out h-full border-r border-gray-200
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar 
          isDesktopOpen={isDesktopSidebarOpen} 
          onToggleDesktop={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
          chatSessions={[]} 
          onNewChat={() => navigate('/chat')}
        />
      </div>

      <div className="flex-1 flex flex-col h-full bg-gray-50 relative min-w-0 overflow-y-auto">
        <ChatHeader 
          user={user} 
          isDesktopSidebarOpen={isDesktopSidebarOpen}
          onMenuClick={handleMenuClick}
        />

        <main className="flex-1 p-6 lg:p-8 flex flex-col z-0">
          <div className="max-w-7xl mx-auto w-full space-y-6 flex-1 flex flex-col">
            
            {/* Header Sederhana */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div>
                <button 
                  onClick={() => navigate('/wawasan')}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-3 transition-colors focus:outline-none"
                >
                  <ArrowLeft size={16} /> Kembali ke Wawasan
                </button>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Map className="text-gray-600" size={24} /> Peta Indeks Kebahagiaan Nasional (BPS 2021)
                </h1>
                <p className="text-gray-600 mt-1 text-sm">
                  Distribusi geospasial 10 provinsi survei SPTK. Menampilkan 5 provinsi dengan indeks tertinggi dan 5 provinsi terendah.
                </p>
              </div>
            </div>

            {/* Layout 2 Kolom: Peta dan Statistik */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[500px]">
              
              {/* Kolom Peta */}
              <div className="lg:col-span-2 w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden relative z-0 flex flex-col">
                <div className="flex-1 w-full relative">
                  <MapContainer center={[-2.5489, 118.0149]} zoom={5} style={{ height: '100%', width: '100%', minHeight: '400px', zIndex: 0 }}>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {bpsHappinessData.map((prov) => (
                      <CircleMarker 
                        key={prov.id} 
                        center={[prov.lat, prov.lng]} 
                        pathOptions={{ 
                          fillColor: getStatusColor(prov.status), 
                          color: getStatusColor(prov.status), 
                          fillOpacity: 0.7, 
                          weight: 1 
                        }} 
                        radius={12}
                      >
                        <Popup>
                          <div className="p-1 min-w-[200px]">
                            <h3 className="font-bold text-gray-800 text-sm mb-1">{prov.province}</h3>
                            <div className="text-xs text-gray-600 mb-2 border-b pb-2">
                              Skor Indeks BPS: <b className="text-gray-800">{prov.index}</b>
                            </div>
                            <p className="text-[11px] text-gray-600">
                              Keterangan: {prov.insight}
                            </p>
                          </div>
                        </Popup>
                      </CircleMarker>
                    ))}
                  </MapContainer>
                </div>
              </div>

              {/* Kolom Kanan: Statistik Data */}
              <div className="w-full flex flex-col gap-6">
                
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-gray-100">
                    <FileText className="text-gray-600" size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Sumber Data</p>
                    <h3 className="text-lg font-bold text-gray-800 mt-0.5">BPS Indonesia</h3>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex-1 flex flex-col">
                  <h2 className="text-base font-bold text-gray-800 flex items-center gap-2 mb-4">
                    <Activity size={18} className="text-gray-600"/> Data Peringkat Provinsi
                  </h2>
                  
                  <div className="flex-1 w-full min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                        <XAxis type="number" domain={[65, 80]} hide />
                        <YAxis dataKey="province" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#4b5563', fontWeight: 500 }} width={80} />
                        <RechartsTooltip 
                          cursor={{ fill: '#f9fafb' }}
                          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: 'none' }}
                        />
                        <Bar dataKey="index" radius={[0, 4, 4, 0]} barSize={14}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </main>
      </div>
      
      <ConfirmActionModal 
        isOpen={showLoginPrompt} 
        onClose={() => setShowLoginPrompt(false)} 
        title={t('auth.accessRestricted')}
        description={t('auth.accessRestrictedDesc')}
        icon={ShieldAlert}
        confirmText={t('auth.login')}
        confirmIcon={LogIn}
        onConfirm={() => navigate('/login')}
      />
    </div>
  );
};

export default GeoMapPage;
