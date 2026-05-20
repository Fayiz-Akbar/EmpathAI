import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Loader2, UserPlus, Eye, EyeOff } from 'lucide-react';
import { registerUser } from '../services/authService';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // State untuk mengontrol visibilitas password
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      setErrorMsg('Semua kolom wajib diisi.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password minimal harus 6 karakter.');
      return;
    }

    setIsLoading(true);
    try {
      // Panggil API Backend
      await registerUser(formData);
      
      setSuccessMsg('Registrasi berhasil! Mengarahkan ke halaman login...');
      
      // Tunggu sebentar agar user bisa membaca pesan sukses, lalu lempar ke login
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
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 font-sans p-4 relative overflow-hidden">
      
      {/* Background Ornamen (Dibalik posisinya dari Login agar terasa beda) */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-red-400/10 rounded-full blur-3xl opacity-50"></div>

      <div className="w-full max-w-md bg-white rounded-4xl shadow-xl p-8 sm:p-10 relative z-10 border border-gray-100">
        
        {/* Header / Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-semibold font-[Outfit] tracking-tight text-gray-800 mb-2">
              Gabung <span className="bg-linear-to-r from-[#4b90ff] to-[#ff5546] bg-clip-text text-transparent">EmpathAI</span>
            </h1>
          </Link>
          <p className="text-gray-500 text-sm">Buat akun untuk memulai perjalananmu</p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg animate-in fade-in slide-in-from-top-2">
            {errorMsg}
          </div>
        )}
        
        {/* Success Alert */}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm rounded-r-lg animate-in fade-in slide-in-from-top-2 flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" /> {successMsg}
          </div>
        )}

        {/* Form Register */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Input Nama */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 pl-1">Nama Lengkap</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Fayiz Akbar"
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-2xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all"
                required
                disabled={isLoading || successMsg}
              />
            </div>
          </div>

          {/* Input Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 pl-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-2xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all"
                required
                disabled={isLoading || successMsg}
              />
            </div>
          </div>

          {/* Input Password dengan Toggle Mata */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 pl-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 6 karakter"
                // Perhatikan pr-12 agar teks tidak menabrak ikon mata
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-2xl pl-11 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all"
                required
                disabled={isLoading || successMsg}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                tabIndex="-1"
                disabled={isLoading || successMsg}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Tombol Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || successMsg}
              className="w-full bg-[#4b90ff] hover:bg-blue-600 text-white font-medium rounded-2xl py-3.5 px-4 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {isLoading || successMsg ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> Mendaftarkan...
                </>
              ) : (
                <>
                  Daftar Akun <UserPlus size={18} />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-[#4b90ff] font-semibold hover:underline transition-all">
            Login di sini
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;