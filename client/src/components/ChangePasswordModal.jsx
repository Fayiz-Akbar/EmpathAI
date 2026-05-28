import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Lock, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { changePassword } from '../services/authService';

/**
 * ChangePasswordModal — Modal form for changing user password.
 * Features password visibility toggles, client-side validation,
 * and integration with the existing notification event system.
 *
 * @param {boolean} isOpen - Whether the modal is visible.
 * @param {function} onClose - Callback to close the modal.
 */
const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validate = () => {
    const newErrors = {};

    if (!currentPassword) {
      newErrors.currentPassword = 'Password saat ini wajib diisi';
    }
    if (!newPassword) {
      newErrors.newPassword = 'Password baru wajib diisi';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password baru minimal 6 karakter';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password wajib diisi';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }
    if (currentPassword && newPassword && currentPassword === newPassword) {
      newErrors.newPassword = 'Password baru harus berbeda dari yang lama';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await changePassword({ currentPassword, newPassword });

      window.dispatchEvent(
        new CustomEvent('showNotification', {
          detail: { message: 'Password berhasil diubah!', type: 'success' },
        })
      );
      handleClose();
    } catch (error) {
      const msg =
        error.response?.data?.message || 'Gagal mengubah password. Coba lagi.';
      window.dispatchEvent(
        new CustomEvent('showNotification', {
          detail: { message: msg, type: 'error' },
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="relative bg-white dark:bg-[#2a2a3e] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-600 w-full max-w-md overflow-hidden"
        style={{
          animation: 'modalEnter 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#8FA697]/15 dark:bg-[#8FA697]/25">
              <ShieldCheck size={22} className="text-[#5B7062] dark:text-[#A7BDAF]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 font-[Outfit]">
                Ubah Password
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                Pastikan password baru Anda aman
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pt-4 pb-2">
          {/* Current Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Password Saat Ini
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={16} />
              </div>
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  if (errors.currentPassword) setErrors((prev) => ({ ...prev, currentPassword: '' }));
                }}
                placeholder="Masukkan password saat ini"
                className={`w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50 dark:bg-[#1e1e2e] border rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${
                  errors.currentPassword
                    ? 'border-red-300 dark:border-red-500 focus:ring-red-200 dark:focus:ring-red-800'
                    : 'border-gray-200 dark:border-gray-600 focus:ring-[#8FA697]/30 focus:border-[#8FA697]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-xs text-red-500 mt-1">{errors.currentPassword}</p>
            )}
          </div>

          {/* New Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Password Baru
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={16} />
              </div>
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (errors.newPassword) setErrors((prev) => ({ ...prev, newPassword: '' }));
                }}
                placeholder="Minimal 6 karakter"
                className={`w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50 dark:bg-[#1e1e2e] border rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${
                  errors.newPassword
                    ? 'border-red-300 dark:border-red-500 focus:ring-red-200 dark:focus:ring-red-800'
                    : 'border-gray-200 dark:border-gray-600 focus:ring-[#8FA697]/30 focus:border-[#8FA697]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-xs text-red-500 mt-1">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Konfirmasi Password Baru
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={16} />
              </div>
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                }}
                placeholder="Ketik ulang password baru"
                className={`w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50 dark:bg-[#1e1e2e] border rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${
                  errors.confirmPassword
                    ? 'border-red-300 dark:border-red-500 focus:ring-red-200 dark:focus:ring-red-800'
                    : 'border-gray-200 dark:border-gray-600 focus:ring-[#8FA697]/30 focus:border-[#8FA697]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
            )}
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-[#232336] border-t border-gray-100 dark:border-gray-700">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#2a2a3e] border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-[#8FA697] hover:bg-[#7A9182] rounded-xl transition-all focus:outline-none shadow-sm active:scale-[0.97] disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Menyimpan...
              </>
            ) : (
              'Simpan Password'
            )}
          </button>
        </div>
      </div>

      {/* Inline animation keyframes */}
      <style>{`
        @keyframes modalEnter {
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
    </div>,
    document.body
  );
};

export default ChangePasswordModal;
