import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const AuthLayout = ({ children, title, subtitle, footerText = '', footerLinkText = '', footerLinkTo = '/' }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-bg-main px-4">
      {/* Background is clean white/light gray as per design */}
      <div className="w-full max-w-sm relative z-10 animate-fade-in-up px-6 py-8 sm:px-0">
        <div className="flex justify-center mb-6 w-full">
          <div className="w-[72px] h-[72px] bg-[#E8EDEB] rounded-full"></div>
        </div>
        <div className="text-center mb-8 w-full">
          <h1 className="text-[32px] font-bold text-[#1E293B] mb-2 tracking-tight font-[Outfit]">{title}</h1>
          <p className="text-[15px] text-text-interactive">{subtitle}</p>
        </div>
        <div className="w-full">{children}</div>
        {footerText && footerLinkText && (
          <p className="text-center text-[15px] mt-10 text-text-interactive">
            {footerText}{' '}
            <Link className="font-bold text-primary hover:text-primary-hover transition-colors" to={footerLinkTo}>
              {footerLinkText}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};
AuthLayout.propTypes = { children: PropTypes.node.isRequired, title: PropTypes.string.isRequired, subtitle: PropTypes.string.isRequired, footerText: PropTypes.string, footerLinkText: PropTypes.string, footerLinkTo: PropTypes.string };
export default AuthLayout;
