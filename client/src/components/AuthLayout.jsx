import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * AuthLayout — Wrapper component for Login & Register pages.
 * Centers the form card on a mobile-first container with #FAF9F6 background.
 * Renders title, subtitle, children (form), and footer navigation link.
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
    <div className="max-w-md mx-auto w-full min-h-screen bg-[#FAF9F6] relative shadow-lg overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#8FA697] opacity-[0.04]" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-[#8FA697] opacity-[0.03]" />
      </div>

      {/* Form Card */}
      <div className="w-full max-w-sm bg-white rounded-3xl p-8 flex flex-col gap-4 shadow-sm relative z-10 animate-fade-in-up">
        {/* Header — no graphic/avatar above the title per design spec */}
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold text-[#1E293B] mb-1 font-[Outfit]">
            {title}
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Form Content */}
        {children}

        {/* Footer Link */}
        {footerText && footerLinkText && (
          <p className="text-center text-[13px] mt-2 text-gray-400">
            {footerText}{' '}
            <Link
              to={footerLinkTo}
              className="font-semibold text-[#8FA697] hover:text-[#6e8c78] transition-colors duration-200 ml-0.5"
            >
              {footerLinkText}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  footerText: PropTypes.string,
  footerLinkText: PropTypes.string,
  footerLinkTo: PropTypes.string,
};

export default AuthLayout;
