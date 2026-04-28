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
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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

      setApiMessage({ type: 'success', text: data.message || 'Log in successful!' });

      // Brief delay so user sees success feedback before redirect
      setTimeout(() => {
        navigate('/');
      }, 800);
    } catch (error) {
      const message =
        error.response?.data?.message || 'An error occurred. Please try again.';
      setApiMessage({ type: 'error', text: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome to EmpathAI"
      subtitle="Your safe space for mental well-being."
      logo={<div className="w-[72px] h-[72px] bg-[#E2E8F0] rounded-full"></div>}
      footerText="Don't have an account?"
      footerLinkText="Sign up"
      footerLinkTo="/register"
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-[18px]">
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

        {/* Email Field */}
        <AuthInput
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email address"
          error={errors.email}
          required
          autoComplete="email"
        />

        {/* Password Field */}
        <AuthInput
          id="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          error={errors.password}
          required
          autoComplete="current-password"
        />

        {/* Forgot Password Link */}
        <div className="flex justify-end -mt-2 mb-2">
          <button
            type="button"
            className="text-sm text-[#94A3B8] hover:text-[#4A5568] transition-colors"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <div className="mt-2">
          <AuthButton
            id="login-button"
            type="submit"
            isLoading={isLoading}
          >
            Sign In
          </AuthButton>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
