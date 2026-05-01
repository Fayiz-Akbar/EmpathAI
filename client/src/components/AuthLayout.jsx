import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * AuthLayout — Wrapper component for Login & Register pages.
 * Enforces a strict mobile-first layout inside a desktop container.
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
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4">
      {/* Ini adalah Wadah HP (Mobile Container) */}
      <div className="w-full max-w-[400px] h-[100dvh] sm:h-[850px] sm:rounded-[40px] bg-[#FAF9F6] relative shadow-2xl overflow-hidden flex flex-col">
        
        {/* Wrapper isi Auth */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          
          {/* Card Form (Putih) */}
          <div className="w-full bg-white rounded-3xl p-8 flex flex-col gap-4 shadow-sm relative z-10">
            {/* Header */}
            <div className="text-center mb-2 w-full">
              <h1 className="text-2xl font-bold text-[#1E293B] mb-1.5 tracking-tight">
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
              <p className="text-center text-sm mt-4 text-[#64748B]">
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
