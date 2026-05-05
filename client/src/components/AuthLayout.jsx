import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * AuthLayout — Wrapper component for Login & Register pages.
 * Full-screen responsive layout: cream background fills the entire viewport,
 * only the form card is width-constrained for readability.
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
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FAF9F6] px-4">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#8FA697]/5 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#8FA697]/5 rounded-full blur-3xl animate-pulse-soft delay-200" />
      </div>

      {/* Form Card */}
      <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-sm relative z-10 animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-6 w-full">
          <h1 className="text-2xl font-bold text-[#1E293B] mb-1.5 tracking-tight font-[Outfit]">
            {title}
          </h1>
          <p className="text-sm text-[#64748B]">
            {subtitle}
          </p>
        </div>

        {/* Form Content */}
        <div className="w-full">
          {children}
        </div>

        {/* Footer Link */}
        {footerText && footerLinkText && (
          <p className="text-center text-sm mt-6 text-[#64748B]">
            {footerText}{' '}
            <Link
              to={footerLinkTo}
              className="font-bold text-[#8FA697] hover:text-[#7D9587] transition-colors"
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
