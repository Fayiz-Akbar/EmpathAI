/**
 * AuthButton — A reusable, animated button component for authentication forms.
 *
 * @param {Object} props
 * @param {string} props.children - Button label text.
 * @param {string} [props.type] - Button type attribute (default: 'submit').
 * @param {boolean} [props.isLoading] - Whether the button is in a loading state.
 * @param {boolean} [props.disabled] - Whether the button is disabled.
 * @param {Function} [props.onClick] - Click handler callback.
 * @param {string} [props.variant] - Button variant: 'primary' or 'outline'.
 * @param {string} [props.id] - Unique identifier for testing.
 */
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

  const baseStyles = {
    fontFamily: 'var(--font-heading)',
    borderRadius: 'var(--radius-button)',
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const variantStyles =
    variant === 'primary'
      ? {
          backgroundColor: isDisabled ? 'var(--color-primary-light)' : 'var(--color-primary)',
          color: '#FFFFFF',
          border: 'none',
          boxShadow: isDisabled ? 'none' : 'var(--shadow-button)',
        }
      : {
          backgroundColor: 'transparent',
          color: 'var(--color-primary)',
          border: '1.5px solid var(--color-primary)',
          boxShadow: 'none',
        };

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        w-full py-3.5 px-6 text-sm font-semibold
        flex items-center justify-center gap-2
        cursor-pointer
        animate-fade-in-up opacity-0 delay-400
        ${isDisabled ? 'cursor-not-allowed' : ''}
      `}
      style={{ ...baseStyles, ...variantStyles }}
      onMouseEnter={(e) => {
        if (!isDisabled && variant === 'primary') {
          e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
          e.currentTarget.style.boxShadow = 'var(--shadow-button-hover)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        } else if (!isDisabled && variant === 'outline') {
          e.currentTarget.style.backgroundColor = 'var(--color-primary-subtle)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isDisabled && variant === 'primary') {
          e.currentTarget.style.backgroundColor = 'var(--color-primary)';
          e.currentTarget.style.boxShadow = 'var(--shadow-button)';
          e.currentTarget.style.transform = 'translateY(0)';
        } else if (!isDisabled && variant === 'outline') {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
      onMouseDown={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
        }
      }}
      onMouseUp={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.transform = 'translateY(-1px) scale(1)';
        }
      }}
    >
      {/* Loading Spinner */}
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
