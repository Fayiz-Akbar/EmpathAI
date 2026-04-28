import { useState } from 'react';

/**
 * AuthInput — A reusable, accessible input field component for authentication forms.
 *
 * @param {Object} props
 * @param {string} props.id - Unique identifier for the input element.
 * @param {string} props.label - Label text displayed above the input.
 * @param {string} props.type - Input type (e.g., 'text', 'email', 'password').
 * @param {string} props.value - Controlled input value.
 * @param {Function} props.onChange - Change handler callback.
 * @param {string} [props.placeholder] - Placeholder text.
 * @param {string} [props.error] - Error message to display below the input.
 * @param {boolean} [props.required] - Whether the field is required.
 * @param {string} [props.autoComplete] - HTML autocomplete attribute value.
 * @param {string} [props.animationDelay] - CSS class for staggered animation delay.
 */
const AuthInput = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error = '',
  required = false,
  autoComplete = 'off',
  animationDelay = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === 'password';
  const inputType = isPasswordField && showPassword ? 'text' : type;

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={`flex flex-col gap-1.5 animate-fade-in-up opacity-0 ${animationDelay}`}>
      {/* Label */}
      <label
        htmlFor={id}
        className="text-sm font-medium transition-colors duration-200"
        style={{ color: isFocused ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}
      >
        {label}
        {required && <span className="ml-0.5" style={{ color: 'var(--color-error)' }}>*</span>}
      </label>

      {/* Input Wrapper */}
      <div className="relative">
        <input
          id={id}
          name={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full px-4 py-3 text-sm rounded-xl border transition-all duration-200 focus:outline-none"
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text-primary)',
            backgroundColor: isFocused ? 'var(--color-bg-card)' : 'var(--color-bg-input)',
            borderColor: error
              ? 'var(--color-error)'
              : isFocused
                ? 'var(--color-border-focus)'
                : 'var(--color-border)',
            borderRadius: 'var(--radius-input)',
            boxShadow: isFocused
              ? error
                ? '0 0 0 3px rgba(229, 115, 115, 0.15)'
                : 'var(--shadow-input-focus)'
              : 'none',
            paddingRight: isPasswordField ? '48px' : '16px',
          }}
        />

        {/* Password Toggle Button */}
        {isPasswordField && (
          <button
            type="button"
            onClick={handleTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors duration-200 hover:bg-gray-100 focus:outline-none"
            style={{ color: 'var(--color-text-secondary)' }}
            tabIndex={-1}
            aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
          >
            {showPassword ? (
              /* Eye-off icon */
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              /* Eye icon */
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p
          className="text-xs mt-0.5 animate-fade-in flex items-center gap-1"
          style={{ color: 'var(--color-error)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default AuthInput;
