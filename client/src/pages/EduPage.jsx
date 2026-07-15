import { useState } from 'react';
import { BookOpen, AlertCircle, Lightbulb, ArrowRight, ShieldAlert, LogIn, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getCurrentUser } from '../services/authService';
import Sidebar from '../components/Sidebar';
import ChatHeader from '../components/ChatHeader';
import ConfirmActionModal from '../components/ConfirmActionModal';

const EduPage = () => {
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
    <div className="h-screen w-full flex overflow-hidden bg-[#FAF9F6] dark:bg-[#121220] font-sans text-gray-800 dark:text-gray-100 relative">
      
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
          chatSessions={[]} 
          onNewChat={() => navigate('/chat')}
        />
      </div>

      <div className="flex-1 flex flex-col h-full bg-[#FAF9F6] dark:bg-[#1a1a2e] relative min-w-0 overflow-y-auto">
        <ChatHeader 
          user={user} 
          isDesktopSidebarOpen={isDesktopSidebarOpen}
          onMenuClick={handleMenuClick}
        />

        <main className="flex-1 p-6 lg:p-12 flex flex-col items-center">
          <div className="max-w-4xl w-full space-y-10 animate-fade-in mt-4">
            
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-2">
                <BookOpen className="text-blue-600 dark:text-blue-400" size={32} />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 font-[Outfit]">
                Mengapa Indonesia Membutuhkan <span className="text-blue-600 dark:text-blue-400">EmpathAI</span>?
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
                Kesehatan mental bukan lagi sekadar isu personal, melainkan tantangan skala nasional yang dipengaruhi oleh lingkungan, pemerataan ekonomi, dan tekanan gaya hidup.
              </p>
            </div>

            {/* Artikel / Konten */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white dark:bg-[#2a2a3e] border border-gray-100 dark:border-gray-700 rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <AlertCircle className="text-red-500" size={24} />
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 font-[Outfit]">Urgensi Kesehatan Mental</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                  Di kota-kota besar dengan tekanan urbanisasi tinggi (seperti Banten dan Jawa Barat), kompetisi dan kepadatan penduduk sering kali meningkatkan risiko stres dan kecemasan. Sebaliknya, di daerah pelosok, kurangnya fasilitas penunjang juga menjadi pemicu menurunnya kepuasan hidup masyarakat.
                </p>
              </div>

              <div className="bg-white dark:bg-[#2a2a3e] border border-gray-100 dark:border-gray-700 rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <Lightbulb className="text-yellow-500" size={24} />
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 font-[Outfit]">Solusi dari EmpathAI</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                  EmpathAI hadir menjembatani kesenjangan tersebut. Melalui kecerdasan buatan, kami mampu memberikan intervensi dini yang terjangkau dan merata. Lebih dari sekadar chatbot, data sentimen anonim yang dikumpulkan dapat dipetakan menjadi informasi geospasial yang berharga untuk pemerintah.
                </p>
              </div>
            </div>

            {/* Call to action */}
            <div className="mt-12 text-center bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-3xl p-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
              <Sparkles className="text-blue-500 mx-auto mb-4" size={32} />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 font-[Outfit]">
                Buktikan Melalui Data
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto text-sm">
                Kami telah menyusun visualisasi data Indeks Kebahagiaan Nasional terbaru dari Badan Pusat Statistik (BPS) sebagai bukti nyata dari penjelasan di atas.
              </p>
              <button 
                onClick={() => navigate('/sig-map')}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg focus:outline-none"
              >
                Lihat Data Kebahagiaan Indonesia <ArrowRight size={18} />
              </button>
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

export default EduPage;
