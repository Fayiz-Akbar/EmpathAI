import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Info, HelpCircle, MessageSquare, Check } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ChatHeader from '../components/ChatHeader';
import { getCurrentUser } from '../services/authService';
import { getUserSessions, renameSession, deleteSession, pinSession } from '../services/chatService';
import ConfirmDialog from '../components/ConfirmDialog';
import { useTranslation } from 'react-i18next';
import FAQ from '../components/FAQ';

// Sub-components for each tab
const LanguageTab = () => {
  const { i18n } = useTranslation();
  const LANG_OPTIONS = [
    { key: 'id', label: 'Indonesia' },
    { key: 'en', label: 'English' }
  ];

  const handleLangSelect = (selectedLang) => {
    i18n.changeLanguage(selectedLang);
    localStorage.setItem('empathAI_lang', selectedLang);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Language Settings</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Choose your preferred language for the application interface.</p>
        <div className="flex flex-col gap-3 max-w-sm">
          {LANG_OPTIONS.map((item) => (
            <button
              key={item.key}
              onClick={() => handleLangSelect(item.key)}
              className={`flex items-center justify-between px-4 py-3 border rounded-xl transition-all ${
                i18n.language === item.key
                  ? 'border-[#8FA697] bg-[#8FA697]/10 text-[#5B7062] dark:text-[#A7BDAF]'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2a3e] text-gray-700 dark:text-gray-300 hover:border-[#8FA697]/50'
              }`}
            >
              <span className="font-medium">{item.label}</span>
              {i18n.language === item.key && <Check size={18} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const AboutTab = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">About EmpathAI</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Learn more about our system and important medical disclaimers.</p>
      </div>

      <div className="bg-white dark:bg-[#2a2a3e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <p className="leading-relaxed text-gray-600 dark:text-gray-300">
          <strong className="text-gray-800 dark:text-gray-100 text-lg">EmpathAI</strong> adalah asisten virtual kesehatan mental yang ditenagai oleh kecerdasan buatan (NLP & Machine Learning). Sistem ini dirancang untuk mendeteksi emosi dari teks percakapan Anda dan memberikan dukungan afirmatif, serta rekomendasi aktivitas <em>self-care</em> harian.
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 rounded-r-2xl p-6 flex flex-col sm:flex-row gap-4 items-start">
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg text-amber-800 dark:text-amber-400">Peringatan Medis (Medical Disclaimer)</h3>
          <p className="text-amber-700 dark:text-amber-200 leading-relaxed">
            EmpathAI <strong>BUKAN</strong> pengganti tenaga medis, psikolog, atau psikiater profesional. Sistem AI dapat berhalusinasi atau memberikan respons yang tidak akurat. 
            <br /><br />
            <strong>Jangan gunakan aplikasi ini untuk diagnosis medis atau saat Anda berada dalam situasi krisis/darurat.</strong>
          </p>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">Kontak Darurat</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Jika Anda atau orang terdekat sedang mengalami krisis psikologis berat atau memiliki pikiran untuk menyakiti diri sendiri, segera hubungi profesional:
        </p>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-100 text-lg">Layanan Sejiwa (Kemenkes RI)</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Layanan Psikologi untuk Kesehatan Jiwa</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold py-2 px-5 rounded-xl border border-red-100 dark:border-red-800/50">
            Hubungi: 119 ekstensi 8
          </div>
        </div>
      </div>
    </div>
  );
};

const FeedbackTab = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Feedback & Suggestions</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Help us improve EmpathAI by sharing your thoughts.</p>
        
        <form className="space-y-4 max-w-2xl" onSubmit={(e) => { e.preventDefault(); alert("Terima kasih atas tanggapan Anda!"); }}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
            <input type="text" className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2a3e] rounded-xl px-4 py-2.5 focus:ring-[#8FA697] focus:border-transparent outline-none" placeholder="What is this regarding?" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
            <textarea rows="5" className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2a3e] rounded-xl px-4 py-2.5 focus:ring-[#8FA697] focus:border-transparent outline-none resize-none" placeholder="Type your feedback here..." required></textarea>
          </div>
          <button type="submit" className="bg-[#8FA697] hover:bg-[#7A9182] text-white font-medium py-2.5 px-6 rounded-xl transition-colors">
            Send Feedback
          </button>
        </form>
      </div>
    </div>
  );
};


const SettingsPage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const userId = user ? (user._id || user.id) : null;
  
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  
  const [chatSessions, setChatSessions] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, sessionId: null });

  // Tab state
  const [activeTab, setActiveTab] = useState('language');

  const TABS = [
    { id: 'language', label: 'Language', icon: Globe },
    { id: 'about', label: 'About EmpathAI', icon: Info },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare }
  ];

  // Fetch Sidebar Sessions
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      try {
        const sessionsRes = await getUserSessions(userId);
        setChatSessions(sessionsRes.data || []);
      } catch (error) {
        console.error("Gagal memuat data:", error);
      }
    };
    fetchData();
  }, [userId]);

  // Sidebar Handlers
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
    } catch { /* ignore error */ }
  };
  const handleDeleteSession = (id) => setDeleteConfirm({ isOpen: true, sessionId: id });
  const confirmDeleteSession = async () => {
    const id = deleteConfirm.sessionId;
    setDeleteConfirm({ isOpen: false, sessionId: null });
    try {
      await deleteSession(id);
      setChatSessions(prev => prev.filter(s => s._id !== id));
      window.dispatchEvent(new CustomEvent('showNotification', { detail: { message: 'Obrolan dihapus.', type: 'success' } }));
    } catch { /* ignore error */ }
  };
  const handlePinSession = async (id, isPinned) => {
    try {
      await pinSession(id, isPinned);
      setChatSessions(prev => {
        const targetIdx = prev.findIndex(s => s._id === id);
        if (targetIdx === -1) return prev;
        const target = { ...prev[targetIdx], isPinned };
        const others = prev.filter(s => s._id !== id);
        return [target, ...others].sort((a, b) => {
          if (a.isPinned === b.isPinned) return 0;
          return a.isPinned ? -1 : 1;
        });
      });
    } catch { /* ignore error */ }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'language': return <LanguageTab />;
      case 'about': return <AboutTab />;
      case 'faq': return <FAQ />;
      case 'feedback': return <FeedbackTab />;
      default: return null;
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#FAF9F6] dark:bg-[#121220] font-sans text-gray-800 dark:text-gray-100 relative">
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity" onClick={() => setIsMobileSidebarOpen(false)} />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 md:static md:block transform transition-transform duration-300 ease-in-out h-full ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <Sidebar 
          isDesktopOpen={isDesktopSidebarOpen} 
          onToggleDesktop={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
          chatSessions={chatSessions}
          activeSessionId={null} 
          onSelectSession={handleSelectSession}
          onNewChat={handleNewChat}
          onRenameSession={handleRenameSession}
          onDeleteSession={handleDeleteSession}
          onPinSession={handlePinSession}
        />
      </div>

      <div className="flex-1 flex flex-col h-full bg-[#FAF9F6] dark:bg-[#1a1a2e] relative min-w-0">
        <ChatHeader 
          user={user} 
          isDesktopSidebarOpen={isDesktopSidebarOpen}
          onMenuClick={() => { setIsMobileSidebarOpen(true); setIsDesktopSidebarOpen(!isDesktopSidebarOpen); }} 
        />

        <main className="flex-1 overflow-y-auto no-scrollbar p-6 lg:p-10">
          <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 font-[Outfit]">Settings & Help</h1>
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Internal Sidebar / Tab Menu */}
              <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left font-medium ${
                      activeTab === tab.id
                        ? 'bg-[#8FA697] text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-[#8FA697]/10 dark:hover:bg-[#8FA697]/20 hover:text-[#5B7062] dark:hover:text-[#A7BDAF]'
                    }`}
                  >
                    <tab.icon size={18} className={activeTab === tab.id ? 'text-white' : 'text-gray-400 group-hover:text-[#5B7062]'} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content Area */}
              <div className="flex-1 bg-white dark:bg-[#1e1e2e] rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-800 min-h-[500px]">
                {renderContent()}
              </div>
            </div>
          </div>
        </main>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Hapus Obrolan"
        message="Yakin ingin menghapus riwayat obrolan ini?"
        confirmText="Hapus"
        cancelText="Batal"
        variant="danger"
        onConfirm={confirmDeleteSession}
        onCancel={() => setDeleteConfirm({ isOpen: false, sessionId: null })}
      />
    </div>
  );
};

export default SettingsPage;
