import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, KeyRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { resetPassword } from '../services/authService';
import PasswordInput from '../components/PasswordInput';

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return;

    if (newPassword !== confirmPassword) {
      setErrorMsg(t('auth.passwordsDoNotMatch'));
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg(t('auth.passwordTooShort'));
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      await resetPassword({ token, newPassword });
      setSuccessMsg(t('auth.resetPasswordSuccess'));
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || t('auth.resetPasswordError'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="text-center">
          <p className="text-red-500 mb-4">{t('auth.invalidToken')}</p>
          <button onClick={() => navigate('/login')} className="text-[#5B7062] underline">
            {t('auth.backToLogin')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FAF9F6] font-sans p-4 relative">
      <div className="w-full max-w-md bg-white sm:rounded-4xl sm:shadow-sm p-6 sm:p-10 relative z-10 sm:border border-gray-100 flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center mb-8 w-full">
          <div className="w-12 h-12 bg-[#8FA697]/15 rounded-full flex items-center justify-center mx-auto mb-4">
            <KeyRound className="text-[#5B7062]" size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-2 font-[Outfit]">
            {t('auth.resetPasswordTitle')}
          </h1>
          <p className="text-gray-500 text-sm px-4">
            {t('auth.resetPasswordDesc')}
          </p>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mb-6 w-full p-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl text-center">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 w-full p-4 bg-[#8FA697]/10 border border-[#8FA697]/20 text-[#5B7062] text-sm rounded-xl text-center flex flex-col items-center gap-2">
            <span>{successMsg}</span>
            <Loader2 size={16} className="animate-spin" />
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">{t('auth.newPassword')}</label>
            <PasswordInput
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t('auth.newPasswordPlaceholder')}
              className="w-full bg-white border border-gray-200 text-gray-800 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#8FA697]/20 focus:border-[#8FA697] transition-all placeholder:text-gray-300"
              required
              disabled={isLoading || !!successMsg}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">{t('auth.confirmNewPassword')}</label>
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('auth.confirmNewPasswordPlaceholder')}
              className="w-full bg-white border border-gray-200 text-gray-800 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#8FA697]/20 focus:border-[#8FA697] transition-all placeholder:text-gray-300"
              required
              disabled={isLoading || !!successMsg}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !newPassword || !confirmPassword || !!successMsg}
              className="w-full bg-[#8FA697] hover:bg-[#7A9182] text-white font-semibold rounded-full py-3.5 px-4 transition-all duration-200 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isLoading && !successMsg ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> {t('auth.saving')}
                </>
              ) : (
                t('auth.savePassword')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
