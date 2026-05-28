import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordInput = ({ className = '', ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const timeoutRef = useRef(null);

  const togglePasswordVisibility = () => {
    // If already showing, hide it immediately and clear timeout
    if (showPassword) {
      setShowPassword(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }

    // Show password
    setShowPassword(true);

    // Auto-hide after 2.5 seconds for security
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setShowPassword(false);
    }, 2500);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="relative w-full">
      <input
        type={showPassword ? 'text' : 'password'}
        className={`w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1a1a2e] text-gray-800 dark:text-gray-100 pr-12 focus:outline-none focus:ring-2 focus:ring-[#8FA697] focus:border-transparent transition-all ${className}`}
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
