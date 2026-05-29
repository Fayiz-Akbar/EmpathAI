import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, AlertTriangle, Phone } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ChatHeader from '../components/ChatHeader';
import { getCurrentUser } from '../services/authService';
import { getUserSessions, renameSession, deleteSession, pinSession } from '../services/chatService';
import ConfirmDialog from '../components/ConfirmDialog';

const AboutPage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const userId = user ? (user._id || user.id) : null;
  
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  
  const [chatSessions, setChatSessions] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, sessionId: null });

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

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#FAF9F6] dark:bg-[#121220] font-sans text-gray-800 dark:text-gray-100 relative">
      {/* Mobile Sidebar Overlay */}
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
          onPinSession={handlePinSession}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full bg-[#FAF9F6] dark:bg-[#1a1a2e] relative min-w-0">
        <ChatHeader 
          user={user} 
          isDesktopSidebarOpen={isDesktopSidebarOpen}
          onMenuClick={() => {
            setIsMobileSidebarOpen(true);
            setIsDesktopSidebarOpen(!isDesktopSidebarOpen);
          }} 
        />

        <main className="flex-1 overflow-y-auto no-scrollbar p-6 lg:p-10">
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-6">
              <div>
                <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 font-[Outfit] flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#8FA697]/15 rounded-full flex items-center justify-center">
                    <Info className="text-[#5B7062] dark:text-[#A7BDAF]" size={28} />
                  </div>
                  About EmpathAI
                </h1>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col gap-8 text-base text-gray-600 dark:text-gray-300">
              
              {/* Bagian 1: Visi */}
              <section className="bg-white dark:bg-[#2a2a3e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <p className="leading-relaxed">
                  <strong className="text-gray-800 dark:text-gray-100 text-lg">EmpathAI</strong> adalah asisten virtual kesehatan mental yang ditenagai oleh kecerdasan buatan (NLP & Machine Learning). Sistem ini dirancang untuk mendeteksi emosi dari teks percakapan Anda dan memberikan dukungan afirmatif, serta rekomendasi aktivitas <em>self-care</em> harian.
                </p>
              </section>

              {/* Bagian 2: Medical Disclaimer */}
              <section className="bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 rounded-r-2xl p-6 flex flex-col sm:flex-row gap-4 items-start">
                <AlertTriangle className="text-amber-500 shrink-0 mt-1" size={28} />
                <div className="flex flex-col gap-2">
                  <h3 className="font-bold text-lg text-amber-800 dark:text-amber-400">Peringatan Medis (Medical Disclaimer)</h3>
                  <p className="text-amber-700 dark:text-amber-200 leading-relaxed">
                    EmpathAI <strong>BUKAN</strong> pengganti tenaga medis, psikolog, atau psikiater profesional. Sistem AI dapat berhalusinasi atau memberikan respons yang tidak akurat. 
                    <br /><br />
                    <strong>Jangan gunakan aplikasi ini untuk diagnosis medis atau saat Anda berada dalam situasi krisis/darurat.</strong>
                  </p>
                </div>
              </section>

              {/* Bagian 3: Crisis Contacts */}
              <section className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                    <Phone className="text-red-500" size={20} />
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">Kontak Darurat</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Jika Anda atau orang terdekat sedang mengalami krisis psikologis berat atau memiliki pikiran untuk menyakiti diri sendiri, segera hubungi profesional. Anda bisa menghubungi layanan berikut:
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
              </section>

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

export default AboutPage;
