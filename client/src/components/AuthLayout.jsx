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
  topText = 'Login',
}) => {
  return (
    <div className="max-w-md mx-auto w-full min-h-screen bg-[#FAF9F6] relative shadow-xl overflow-y-auto flex flex-col sm:border sm:border-gray-100 font-sans">
      
      {/* Top Left Text */}
      <div className="px-6 py-6 shrink-0">
        <span className="text-gray-300 font-bold text-lg tracking-wide">{topText}</span>
      </div>

      <div className="flex-1 w-full flex flex-col items-center px-8 pb-10 mt-2">
        {/* Gray Circle Avatar Placeholder */}
        <div className="w-[72px] h-[72px] bg-[#E2E8F0] rounded-full mb-5 shrink-0"></div>

        {/* Header */}
        <div className="text-center mb-8 w-full">
          <h1 className="text-[23px] font-bold text-[#1E293B] mb-2 tracking-tight">
            {title}
          </h1>
          <p className="text-[13.5px] text-[#64748B]">
            {subtitle}
          </p>
        </div>

        {/* Form Content */}
        <div className="w-full">
          {children}
        </div>

        {/* Footer Link */}
        {footerText && footerLinkText && (
          <p className="text-center text-[13.5px] mt-12 text-[#64748B]">
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
  topText: PropTypes.string,
};

export default AuthLayout;
