import { useEffect, useCallback } from 'react';
import { AlertTriangle, X } from 'lucide-react';

/**
 * ConfirmDialog — A reusable, themed confirmation modal.
 * Replaces native window.confirm() with a premium UI experience.
 *
 * @param {boolean} isOpen - Whether the dialog is visible.
 * @param {string} title - Dialog heading (e.g. "Hapus Obrolan").
 * @param {string} message - Descriptive message.
 * @param {string} confirmText - Label for the confirm button (default: "Hapus").
 * @param {string} cancelText - Label for the cancel button (default: "Batal").
 * @param {'danger'|'warning'} variant - Color variant (default: "danger").
 * @param {function} onConfirm - Callback when user confirms.
 * @param {function} onCancel - Callback when user cancels / presses Escape.
 */
const ConfirmDialog = ({
  isOpen,
  title = 'Konfirmasi',
  message = 'Apakah kamu yakin?',
  confirmText = 'Hapus',
  cancelText = 'Batal',
  variant = 'danger',
  onConfirm,
  onCancel,
}) => {
  // Close on Escape key
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onCancel?.();
    },
    [onCancel]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent background scroll
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const isDestructive = variant === 'danger';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div
        className="relative bg-white dark:bg-[#2a2a3e] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-600 w-full max-w-md overflow-hidden"
        style={{ animation: 'dialogEnter 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
      >
        {/* Header */}
        <div className="flex items-start gap-4 px-6 pt-6 pb-2">
          <div
            className={`shrink-0 p-2.5 rounded-xl ${
              isDestructive
                ? 'bg-red-100 dark:bg-red-900/30'
                : 'bg-amber-100 dark:bg-amber-900/30'
            }`}
          >
            <AlertTriangle
              size={22}
              className={isDestructive ? 'text-red-500' : 'text-amber-500'}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 font-[Outfit]">
              {title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
              {message}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="shrink-0 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 mt-2 bg-gray-50 dark:bg-[#232336] border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#2a2a3e] border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-xl transition-all focus:outline-none shadow-sm active:scale-[0.97] ${
              isDestructive
                ? 'bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-red-300 dark:focus:ring-red-800'
                : 'bg-amber-500 hover:bg-amber-600 focus:ring-2 focus:ring-amber-300 dark:focus:ring-amber-800'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>

      {/* Inline animation keyframes */}
      <style>{`
        @keyframes dialogEnter {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ConfirmDialog;
