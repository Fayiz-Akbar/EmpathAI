import { createPortal } from 'react-dom';
import { ArrowLeft } from 'lucide-react';

const ConfirmActionModal = ({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  icon: Icon,
  iconColorClass = "text-amber-600 dark:text-amber-500",
  iconBgClass = "bg-amber-100 dark:bg-amber-900/30",
  confirmText = "Konfirmasi",
  confirmIcon: ConfirmIcon,
  confirmButtonClass = "bg-[#8FA697] hover:bg-[#7a8e81] text-white",
  onConfirm 
}) => {
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
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${iconBgClass}`}>
              {Icon && <Icon className={iconColorClass} size={24} />}
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              {description}
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
                if (onConfirm) onConfirm();
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 font-medium rounded-xl transition-colors focus:outline-none ${confirmButtonClass}`}
            >
              {ConfirmIcon && <ConfirmIcon size={16} />}
              <span>{confirmText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmActionModal;
