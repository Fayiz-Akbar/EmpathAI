import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const AuthLayout = ({ children, title, subtitle, footerText = '', footerLinkText = '', footerLinkTo = '/' }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FAF9F6] px-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#8FA697]/5 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#8FA697]/5 rounded-full blur-3xl animate-pulse-soft delay-200" />
      </div>
      <div className="w-full max-w-sm relative z-10 animate-fade-in-up px-6 py-8 sm:px-0">
        <div className="flex justify-center mb-6 w-full">
          <div className="w-[72px] h-[72px] bg-[#E8EDEB] rounded-full"></div>
        </div>
        <div className="text-center mb-8 w-full">
          <h1 className="text-[26px] font-bold text-[#1E293B] mb-2 tracking-tight font-[Outfit]">{title}</h1>
          <p className="text-[15px] text-[#64748B]">{subtitle}</p>
        </div>
        <div className="w-full">{children}</div>
        {footerText && footerLinkText && (
          <p className="text-center text-[15px] mt-10 text-[#64748B]">
            {footerText}{' '}
            <Link className="font-bold text-[#8FA697] hover:text-[#7D9587] transition-colors" to={footerLinkTo}>
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
