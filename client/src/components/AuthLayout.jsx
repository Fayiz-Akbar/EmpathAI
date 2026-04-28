import { Link } from 'react-router-dom';

/**
 * AuthLayout — A wrapper component providing consistent layout, branding, and
 * decorative elements for all authentication pages (Login & Register).
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The form content to render.
 * @param {string} props.title - The heading text (e.g., "Selamat Datang").
 * @param {string} props.subtitle - The subheading/description text.
 * @param {string} [props.footerText] - Text before the footer link (e.g., "Belum punya akun?").
 * @param {string} [props.footerLinkText] - Text for the footer link (e.g., "Daftar").
 * @param {string} [props.footerLinkTo] - Route path for the footer link.
 */
const AuthLayout = ({
  children,
  title,
  subtitle,
  footerText = '',
  footerLinkText = '',
  footerLinkTo = '/',
}) => {
  return (
    <div
      className="min-h-dvh flex items-center justify-center p-4 relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-main)' }}
    >
      {/* ===== Decorative Background Elements ===== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Large soft circle - top right */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full animate-pulse-soft"
          style={{ backgroundColor: 'var(--color-primary-subtle)', opacity: 0.5 }}
        />
        {/* Medium circle - bottom left */}
        <div
          className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full animate-pulse-soft"
          style={{ backgroundColor: 'var(--color-primary-subtle)', opacity: 0.3, animationDelay: '2s' }}
        />
        {/* Small floating circle */}
        <div
          className="absolute top-1/4 left-8 w-16 h-16 rounded-full animate-float"
          style={{ backgroundColor: 'var(--color-primary-light)', opacity: 0.2 }}
        />
        {/* Tiny accent dot */}
        <div
          className="absolute bottom-1/3 right-12 w-8 h-8 rounded-full animate-float"
          style={{ backgroundColor: 'var(--color-primary)', opacity: 0.1, animationDelay: '3s' }}
        />

        {/* Decorative leaf SVG - top left */}
        <svg
          className="absolute top-16 left-12 animate-float opacity-[0.07]"
          style={{ animationDelay: '1s' }}
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M60 10C60 10 90 30 90 60C90 90 60 110 60 110C60 110 30 90 30 60C30 30 60 10 60 10Z"
            fill="var(--color-primary)"
          />
          <path
            d="M60 30V90"
            stroke="var(--color-bg-main)"
            strokeWidth="1.5"
          />
          <path
            d="M60 50C45 45 40 55 40 55"
            stroke="var(--color-bg-main)"
            strokeWidth="1"
          />
          <path
            d="M60 65C75 60 80 70 80 70"
            stroke="var(--color-bg-main)"
            strokeWidth="1"
          />
        </svg>

        {/* Decorative leaf SVG - bottom right */}
        <svg
          className="absolute bottom-20 right-16 animate-float opacity-[0.05] rotate-45"
          style={{ animationDelay: '4s' }}
          width="80"
          height="80"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M60 10C60 10 90 30 90 60C90 90 60 110 60 110C60 110 30 90 30 60C30 30 60 10 60 10Z"
            fill="var(--color-primary)"
          />
        </svg>
      </div>

      {/* ===== Main Card ===== */}
      <div
        className="w-full max-w-md relative z-10 animate-fade-in-up"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--shadow-card)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div className="px-8 pt-10 pb-8 sm:px-10">
          {/* ===== Branding ===== */}
          <div className="text-center mb-8">
            {/* Logo */}
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 animate-fade-in-up opacity-0"
              style={{
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))',
                boxShadow: 'var(--shadow-button)',
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>

            {/* App Name */}
            <h1
              className="text-2xl font-bold mb-1 animate-fade-in-up opacity-0 delay-100"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
            >
              Empath<span style={{ color: 'var(--color-primary)' }}>AI</span>
            </h1>

            {/* Page Title */}
            <h2
              className="text-lg font-semibold mb-1.5 animate-fade-in-up opacity-0 delay-200"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
            >
              {title}
            </h2>

            {/* Subtitle */}
            <p
              className="text-sm animate-fade-in-up opacity-0 delay-300"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {subtitle}
            </p>
          </div>

          {/* ===== Form Content ===== */}
          {children}

          {/* ===== Footer Link ===== */}
          {footerText && footerLinkText && (
            <p
              className="text-center text-sm mt-6 animate-fade-in-up opacity-0 delay-500"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {footerText}{' '}
              <Link
                to={footerLinkTo}
                className="font-medium transition-colors duration-200 hover:underline underline-offset-2"
                style={{ color: 'var(--color-text-interactive)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-interactive)';
                }}
              >
                {footerLinkText}
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
