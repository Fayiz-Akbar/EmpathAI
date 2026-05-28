import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordInput = ({ className = '', leftIcon: LeftIcon, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const timeoutRef = useRef(null);

  const togglePasswordVisibility = () => {
    if (showPassword) {
      setShowPassword(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }

    setShowPassword(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setShowPassword(false);
    }, 2500);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Base styling for the input, allowing overrides via className
  const baseInputClass = `w-full rounded-xl border bg-white dark:bg-[#1a1a2e] text-gray-800 dark:text-gray-100 pr-12 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
    props.error 
      ? 'border-red-300 dark:border-red-500 focus:ring-red-200 dark:focus:ring-red-800'
      : 'border-gray-200 dark:border-gray-600 focus:ring-[#8FA697]'
  }`;
  
  // Conditionally add left padding if an icon is present, otherwise standard padding
  const paddingClass = LeftIcon ? "pl-10 py-2.5 text-sm" : "px-4 py-3";

  return (
    <div className="relative w-full">
      {LeftIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <LeftIcon size={16} />
        </div>
      )}
      <input
        type={showPassword ? 'text' : 'password'}
        className={`${baseInputClass} ${paddingClass} focus:ring-[#8FA697] ${className}`}
        {...props}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-[#5B7062] dark:hover:text-[#A7BDAF] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors focus:outline-none"
        title={showPassword ? "Sembunyikan Password" : "Tampilkan Sementara"}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
};

export default PasswordInput;
