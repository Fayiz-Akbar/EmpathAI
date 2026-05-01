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
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F3F4F6] relative overflow-hidden font-sans">
      {/* Top Left Text */}
      <div className="absolute top-6 left-6">
        <span className="text-gray-400 font-semibold text-lg tracking-wide">{topText}</span>
      </div>

      {/* Form Card */}
      <div className="w-[90%] max-w-[420px] bg-[#FAF9F6] rounded-[2.5rem] px-8 py-10 shadow-sm border-[6px] border-white flex flex-col items-center relative z-10 my-8">
        
        {/* Gray Circle Avatar Placeholder */}
        <div className="w-[60px] h-[60px] bg-[#E2E8F0] rounded-full mb-6 shrink-0"></div>

        {/* Header */}
        <div className="text-center mb-8 w-full">
          <h1 className="text-[22px] font-bold text-[#1E293B] mb-1.5 tracking-tight">
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
          <p className="text-center text-[13.5px] mt-10 text-[#64748B]">
            {footerText}{' '}
            <Link
              to={footerLinkTo}
              className="font-bold text-[#8FA697] hover:text-[#7a8f81] transition-colors"
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
