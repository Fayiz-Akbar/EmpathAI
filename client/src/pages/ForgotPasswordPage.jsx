import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { forgotPassword } from '../services/authService';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setMessage('');
    setErrorMsg('');

    try {
      await forgotPassword({ email });
      setMessage(t('auth.forgotPasswordSuccess'));
    } catch (error) {
      setErrorMsg(error.response?.data?.message || t('auth.forgotPasswordError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FAF9F6] font-sans p-4 relative">
      <div className="w-full max-w-md bg-white sm:rounded-4xl sm:shadow-sm p-6 sm:p-10 relative z-10 sm:border border-gray-100 flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center mb-8 w-full">
          <Link to="/login" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#5B7062] transition-colors mb-6 self-start">
            <ArrowLeft size={16} className="mr-1" /> {t('auth.backToLogin')}
          </Link>
          <div className="w-12 h-12 bg-[#8FA697]/15 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="text-[#5B7062]" size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-2 font-[Outfit]">
            {t('auth.forgotPasswordTitle')}
          </h1>
          <p className="text-gray-500 text-sm px-4">
            {t('auth.forgotPasswordDesc')}
          </p>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mb-6 w-full p-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl text-center">
            {errorMsg}
          </div>
        )}
        {message && (
          <div className="mb-6 w-full p-4 bg-[#8FA697]/10 border border-[#8FA697]/20 text-[#5B7062] text-sm rounded-xl text-center">
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">{t('auth.emailAddress')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-white border border-gray-200 text-gray-800 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#8FA697]/20 focus:border-[#8FA697] transition-all placeholder:text-gray-300"
              required
              disabled={isLoading || !!message}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !email || !!message}
              className="w-full bg-[#8FA697] hover:bg-[#7A9182] text-white font-semibold rounded-full py-3.5 px-4 transition-all duration-200 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> {t('auth.sending')}
                </>
              ) : (
                t('auth.sendResetLink')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
