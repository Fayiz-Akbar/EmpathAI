import { createPortal } from 'react-dom';
import { LogIn, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPromptModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white dark:bg-[#2a2a3e] w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4">
              <ShieldAlert className="text-amber-600 dark:text-amber-500" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Akses Dibatasi
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Anda tidak dapat menggunakan fitur ini jika belum login. Silakan masuk ke akun Anda terlebih dahulu untuk melanjutkan.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-xl transition-colors focus:outline-none"
            >
              <ArrowLeft size={16} />
              <span>Kembali</span>
            </button>
            <button
              onClick={() => {
                onClose();
                navigate('/login');
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#8FA697] hover:bg-[#7a8e81] text-white font-medium rounded-xl transition-colors focus:outline-none"
            >
              <LogIn size={16} />
              <span>Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LoginPromptModal;
