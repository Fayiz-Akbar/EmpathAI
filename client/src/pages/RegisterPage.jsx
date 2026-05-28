import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { registerUser } from '../services/authService';
import { useTranslation } from 'react-i18next';
import PasswordInput from '../components/PasswordInput';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { t } = useTranslation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setErrorMsg('Semua kolom wajib diisi.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Password dan Confirm Password tidak cocok.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password minimal harus 6 karakter.');
      return;
    }

    setIsLoading(true);
    try {
      await registerUser({ name: formData.name, email: formData.email, password: formData.password });
      setSuccessMsg('Registrasi berhasil! Mengarahkan ke halaman login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Register Error:', error);
      setErrorMsg(error.response?.data?.message || 'Gagal mendaftar. Email mungkin sudah digunakan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FAF9F6] font-sans p-4 relative">
      <div className="w-full max-w-md bg-white sm:rounded-4xl sm:shadow-sm p-6 sm:p-10 relative z-10 sm:border border-gray-100 flex flex-col items-center">
        
        {/* Header / Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2 font-[Outfit]">
              EmpathAI
            </h1>
          </Link>
          <p className="text-gray-500 text-sm">{t('auth.welcomeDesc')}</p>
        </div>

        {/* Error / Success Alerts */}
        {errorMsg && (
          <div className="mb-6 w-full p-3 bg-red-50 text-red-700 text-sm rounded-lg animate-in fade-in slide-in-from-top-2 text-center">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 w-full p-3 bg-green-50 text-green-700 text-sm rounded-lg animate-in fade-in slide-in-from-top-2 flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin" /> {successMsg}
          </div>
        )}

        {/* Form Register */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 pl-1">{t('auth.namePlaceholder')}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t('auth.nameExample')}
              className="w-full bg-white border border-gray-200 text-gray-800 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-300"
              required
              disabled={isLoading || successMsg}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 pl-1">{t('auth.emailPlaceholder')}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('auth.emailExample')}
              className="w-full bg-white border border-gray-200 text-gray-800 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-300"
              required
              disabled={isLoading || successMsg}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 pl-1">{t('auth.passwordPlaceholder')}</label>
            <PasswordInput
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t('auth.createPassword')}
              className="w-full bg-white border border-gray-200 text-gray-800 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8FA697]/20 focus:border-[#8FA697] transition-all placeholder:text-gray-300"
              required
              disabled={isLoading || successMsg}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 pl-1">{t('auth.confirmPassword')}</label>
            <PasswordInput
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder={t('auth.confirmPassword')}
              className="w-full bg-white border border-gray-200 text-gray-800 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8FA697]/20 focus:border-[#8FA697] transition-all placeholder:text-gray-300"
              required
              disabled={isLoading || successMsg}
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading || successMsg}
              className="w-full bg-[#8FA697] hover:bg-[#7A9182] text-white font-semibold rounded-full py-3.5 px-4 transition-all duration-200 focus:outline-none disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {isLoading || successMsg ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> {t('auth.processing')}
                </>
              ) : (
                t('auth.createAccount')
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-[10px] text-gray-400 max-w-xs">
          {t('auth.terms')}
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          {t('auth.haveAccount')} {' '}
          <Link to="/login" className="font-semibold text-gray-700 hover:text-[#8FA697] transition-all">
            {t('auth.login')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;