import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import AuthInput from '../components/AuthInput';
import AuthButton from '../components/AuthButton';
import { registerUser } from '../services/authService';

/**
 * RegisterPage — Handles new user registration.
 * Communicates with POST /api/auth/register and redirects to login on success.
 */
const RegisterPage = () => {
  const navigate = useNavigate();

  // ── Form State ──
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // ── UI State ──
  const [errors, setErrors] = useState({});
  const [apiMessage, setApiMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Updates a single form field and clears its associated error.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (apiMessage.text) {
      setApiMessage({ type: '', text: '' });
    }
  };

  /**
   * Validates all form fields before submission.
   * @returns {boolean} Whether the form is valid.
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama lengkap wajib diisi';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nama minimal 2 karakter';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password wajib diisi';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission — validates, calls API, and processes response.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiMessage({ type: '', text: '' });

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const data = await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      setApiMessage({
        type: 'success',
        text: data.message || 'Registrasi berhasil! Mengalihkan ke halaman login...',
      });

      // Redirect to login after a short delay for success feedback
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      const message =
        error.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.';
      setApiMessage({ type: 'error', text: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Buat Akun Baru"
      subtitle="Mulai perjalanan menuju kesehatan mental yang lebih baik"
      footerText="Sudah punya akun?"
      footerLinkText="Masuk di sini"
      footerLinkTo="/login"
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {/* API Feedback Message */}
        {apiMessage.text && (
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${
              apiMessage.type === 'error'
                ? 'bg-red-50 text-red-500'
                : 'bg-green-50 text-green-600'
            }`}
          >
            {apiMessage.type === 'error' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            )}
            {apiMessage.text}
          </div>
        )}

        {/* Full Name Field */}
        <AuthInput
          id="name"
          label="Nama Lengkap"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Masukkan nama lengkap"
          error={errors.name}
          required
          autoComplete="name"
          animationDelay="delay-100"
        />

        {/* Email Field */}
        <AuthInput
          id="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="contoh@email.com"
          error={errors.email}
          required
          autoComplete="email"
          animationDelay="delay-200"
        />

        {/* Password Field */}
        <AuthInput
          id="password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Minimal 6 karakter"
          error={errors.password}
          required
          autoComplete="new-password"
          animationDelay="delay-300"
        />

        {/* Confirm Password Field */}
        <AuthInput
          id="confirmPassword"
          label="Konfirmasi Password"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Ulangi password"
          error={errors.confirmPassword}
          required
          autoComplete="new-password"
          animationDelay="delay-400"
        />

        {/* Submit Button */}
        <div className="mt-1">
          <AuthButton
            id="register-button"
            type="submit"
            isLoading={isLoading}
          >
            Buat Akun
          </AuthButton>
        </div>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
