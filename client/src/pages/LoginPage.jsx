import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import AuthInput from '../components/AuthInput';
import AuthButton from '../components/AuthButton';
import { loginUser } from '../services/authService';

/**
 * LoginPage — Handles user authentication via email and password.
 * Communicates with POST /api/auth/login and stores JWT token on success.
 */
const LoginPage = () => {
  const navigate = useNavigate();

  // ── Form State ──
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
      const data = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      });

      // Store authentication data
      localStorage.setItem('empathAI_token', data.token);
      localStorage.setItem('empathAI_user', JSON.stringify(data.user));

      setApiMessage({ type: 'success', text: data.message || 'Login berhasil!' });

      // Brief delay so user sees success feedback before redirect
      setTimeout(() => {
        navigate('/');
      }, 800);
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
      title="Selamat Datang Kembali"
      subtitle="Masuk ke akunmu untuk melanjutkan percakapan"
      footerText="Belum punya akun?"
      footerLinkText="Daftar sekarang"
      footerLinkTo="/register"
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {/* API Feedback Message */}
        {apiMessage.text && (
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm animate-fade-in"
            style={{
              backgroundColor:
                apiMessage.type === 'error'
                  ? 'var(--color-error-bg)'
                  : 'var(--color-success-bg)',
              color:
                apiMessage.type === 'error'
                  ? 'var(--color-error)'
                  : 'var(--color-success)',
              borderRadius: 'var(--radius-input)',
            }}
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
          placeholder="Masukkan password"
          error={errors.password}
          required
          autoComplete="current-password"
          animationDelay="delay-300"
        />

        {/* Forgot Password Link */}
        <div className="flex justify-end -mt-1 animate-fade-in-up opacity-0 delay-300">
          <button
            type="button"
            className="text-xs font-medium transition-colors duration-200 cursor-pointer bg-transparent border-none"
            style={{ color: 'var(--color-text-interactive)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-text-interactive)';
            }}
          >
            Lupa password?
          </button>
        </div>

        {/* Submit Button */}
        <AuthButton
          id="login-button"
          type="submit"
          isLoading={isLoading}
        >
          Masuk
        </AuthButton>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
