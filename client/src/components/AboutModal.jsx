import { createPortal } from 'react-dom';
import { X, Info, AlertTriangle, Phone } from 'lucide-react';

const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1a1a2e] rounded-3xl shadow-xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700 bg-[#FAF9F6] dark:bg-[#1a1a2e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#8FA697]/15 rounded-full flex items-center justify-center">
              <Info className="text-[#5B7062] dark:text-[#A7BDAF]" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 font-[Outfit]">About EmpathAI</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6 text-sm text-gray-600 dark:text-gray-300">
          
          {/* Bagian 1: Visi */}
          <section>
            <p className="leading-relaxed">
              <strong className="text-gray-800 dark:text-gray-100">EmpathAI</strong> adalah asisten virtual kesehatan mental yang ditenagai oleh kecerdasan buatan (NLP & Machine Learning). Sistem ini dirancang untuk mendeteksi emosi dari teks percakapan Anda dan memberikan dukungan afirmatif, serta rekomendasi aktivitas <em>self-care</em> harian.
            </p>
          </section>

          {/* Bagian 2: Medical Disclaimer */}
          <section className="bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 rounded-r-xl p-4 flex gap-4">
            <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-amber-800 dark:text-amber-400">Peringatan Medis (Medical Disclaimer)</h3>
              <p className="text-amber-700 dark:text-amber-200 leading-relaxed text-xs">
                EmpathAI <strong>BUKAN</strong> pengganti tenaga medis, psikolog, atau psikiater profesional. Sistem AI dapat berhalusinasi atau memberikan respons yang tidak akurat. 
                <br /><br />
                <strong>Jangan gunakan aplikasi ini untuk diagnosis medis atau saat Anda berada dalam situasi krisis/darurat.</strong>
              </p>
            </div>
          </section>

          {/* Bagian 3: Crisis Contacts */}
          <section className="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                <Phone className="text-red-500" size={16} />
              </div>
              <h3 className="font-bold text-gray-800 dark:text-gray-100">Kontak Darurat</h3>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-xs mb-3">
              Jika Anda atau orang terdekat sedang mengalami krisis psikologis berat atau memiliki pikiran untuk menyakiti diri sendiri, segera hubungi profesional:
            </p>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-3 shadow-sm flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Layanan Sejiwa (Kemenkes RI)</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Layanan Psikologi untuk Kesehatan Jiwa</p>
              </div>
              <a href="tel:119" className="bg-red-500 hover:bg-red-600 text-white font-bold py-1.5 px-4 rounded-full text-xs transition-colors">
                Dial 119 ext 8
              </a>
            </div>
          </section>

        </div>

      </div>
    </div>,
    document.body
  );
};

export default AboutModal;
