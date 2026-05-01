import PropTypes from 'prop-types';

/**
 * AuthButton — Primary green action button for authentication forms.
 * Displays a loading spinner with "Processing..." text when isLoading is true.
 */
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
      className={`
        w-full bg-[#8FA697] text-white font-semibold rounded-full py-3.5
        flex items-center justify-center gap-2
        transition-all duration-200
        ${isDisabled
          ? 'opacity-60 cursor-not-allowed'
          : 'cursor-pointer hover:bg-[#7a8f81] hover:shadow-[0_4px_16px_rgba(143,166,151,0.4)] active:scale-[0.98]'
        }
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
      {isLoading ? 'Processing...' : children}
    </button>
  );
};

AuthButton.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  id: PropTypes.string,
};

export default AuthButton;
