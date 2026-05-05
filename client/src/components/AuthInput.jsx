import { useState } from 'react';
import PropTypes from 'prop-types';

const AuthInput = ({ id, type = 'text', value, onChange, placeholder = '', error = '', required = false, autoComplete = 'off' }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password';
  const inputType = isPasswordField && showPassword ? 'text' : type;

  return (
    <div className="flex flex-col w-full mb-5">
      <div className="relative">
        <input id={id} name={id} type={inputType} value={value} onChange={onChange} placeholder={placeholder} required={required} autoComplete={autoComplete} className={`w-full px-5 py-4 rounded-3xl border bg-white text-[#4A5568] text-[15px] placeholder-[#A0AAB2] transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#8FA697] focus:border-[#8FA697] hover:border-gray-300 ${error ? 'border-red-300 bg-red-50/50' : 'border-gray-200'}`} style={{ paddingRight: isPasswordField ? '64px' : '20px' }} />
        {isPasswordField && (
          <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl transition-colors duration-200 hover:bg-gray-100 focus:outline-none text-[12px] font-bold text-[#8FA697] tracking-wider uppercase" tabIndex={-1}>
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {error && <p className="text-[13px] font-medium text-red-500 mt-1.5 ml-1 flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>{error}</p>}
    </div>
  );
};
AuthInput.propTypes = { id: PropTypes.string.isRequired, type: PropTypes.string, value: PropTypes.string.isRequired, onChange: PropTypes.func.isRequired, placeholder: PropTypes.string, error: PropTypes.string, required: PropTypes.bool, autoComplete: PropTypes.string };
export default AuthInput;