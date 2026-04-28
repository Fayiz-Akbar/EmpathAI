import { useState } from 'react';

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
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password';
  const inputType = isPasswordField && showPassword ? 'text' : type;

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-text-interactive mb-2"
        >
          {label}
        </label>
      )}

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
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-text-primary bg-transparent"
          style={{
            paddingRight: isPasswordField ? '48px' : '16px',
          }}
        />

        {isPasswordField && (
          <button
            type="button"
            onClick={handleTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors duration-200 hover:bg-gray-100 focus:outline-none text-text-secondary"
            tabIndex={-1}
            aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
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
