import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, AlertTriangle } from 'lucide-react';
import { loginUser } from '../services/authService';
import { useTranslation } from 'react-i18next';
import PasswordInput from '../components/PasswordInput';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const { t } = useTranslation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg(''); // Hilangkan error saat user mulai mengetik ulang
    setIsLocked(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrorMsg('Email dan password wajib diisi.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await loginUser(formData);
      if (response.token && response.user) {
        localStorage.setItem('empathAI_token', response.token);
        localStorage.setItem('empathAI_user', JSON.stringify(response.user));
        navigate('/chat');
      } else {
        setErrorMsg('Format respons dari server tidak sesuai.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      const errData = error.response?.data;
      if (errData?.isLocked) {
        setIsLocked(true);
      }
      setErrorMsg(errData?.message || 'Gagal login. Periksa kembali email dan password Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FAF9F6] font-sans p-4 relative">
      <div className="w-full max-w-md bg-white sm:rounded-4xl sm:shadow-sm p-6 sm:p-10 relative z-10 sm:border border-gray-100 flex flex-col items-center">
        
        {/* Header / Logo */}
        <div className="w-20 h-20 bg-[#E8EDEB] rounded-full mb-6"></div>
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2 font-[Outfit]">
              {t('auth.welcome')}
            </h1>
          </Link>
          <p className="text-gray-500 text-sm">{t('auth.welcomeDesc')}</p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className={`mb-6 w-full p-4 text-sm rounded-xl animate-in fade-in slide-in-from-top-2 text-center flex items-center justify-center gap-2 font-medium border ${
            isLocked 
              ? 'bg-amber-50 text-amber-800 border-amber-200 shadow-sm' 
              : 'bg-red-50 text-red-700 border-red-100'
          }`}>
            {isLocked && <AlertTriangle size={18} className="text-amber-600" />}
            {errorMsg}
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('auth.emailPlaceholder')}
              className="w-full bg-white border border-gray-200 text-gray-800 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#8FA697]/20 focus:border-[#8FA697] transition-all placeholder:text-gray-400"
              required
            />
          </div>

          <div>
            <PasswordInput
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t('auth.passwordPlaceholder')}
              className="w-full bg-white border border-gray-200 text-gray-800 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#8FA697]/20 focus:border-[#8FA697] transition-all placeholder:text-gray-400"
              required
            />
          </div>

          {/* Forgot Password */}
          <div className="flex items-center justify-end mb-6">
            <Link 
              to="/forgot-password" 
              className="text-xs font-medium text-gray-500 hover:text-[#5B7062] dark:text-gray-400 dark:hover:text-[#A7BDAF] transition-all hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full px-3 py-1.5 -mr-3"
            >
              {t('auth.forgotPassword')}
            </Link>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#8FA697] hover:bg-[#7A9182] text-white font-semibold rounded-full py-3.5 px-4 transition-all duration-200 focus:outline-none disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> {t('auth.processing')}
                </>
              ) : (
                t('auth.signIn')
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          {t('auth.noAccount')} {' '}
          <Link to="/register" className="font-semibold text-gray-700 hover:text-[#8FA697] transition-all">
            {t('auth.signUp')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;