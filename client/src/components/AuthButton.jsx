const AuthButton = ({
  children,
  type = 'submit',
  isLoading = false,
  disabled = false,
  onClick,
  id,
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`w-full bg-[#8FA697] text-white font-semibold rounded-xl py-3 mt-4 hover:bg-[#7a8f81] transition-colors ${isDisabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
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
