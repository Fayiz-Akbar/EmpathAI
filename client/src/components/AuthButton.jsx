const AuthButton = ({
  children,
  type = 'submit',
  isLoading = false,
  disabled = false,
  onClick,
  variant = 'primary',
  id,
}) => {
  const isDisabled = disabled || isLoading;

  const getVariantClasses = () => {
    if (variant === 'primary') {
      return 'bg-[#8FA697] text-white hover:bg-[#7a9182] border border-transparent';
    }
    return 'bg-transparent text-[#8FA697] border border-[#8FA697] hover:bg-[#FAF9F6]';
  };

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        w-full py-4 px-6 text-sm font-semibold rounded-full
        flex items-center justify-center gap-2
        transition-colors duration-200
        ${isDisabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
        ${getVariantClasses()}
      `}
    >
      {isLoading && (
        <svg
          className="animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      )}
      {isLoading ? 'Memproses...' : children}
    </button>
  );
};

export default AuthButton;
