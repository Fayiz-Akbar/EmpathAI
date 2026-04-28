import { Link } from 'react-router-dom';

const AuthLayout = ({
  children,
  title,
  subtitle,
  footerText = '',
  footerLinkText = '',
  footerLinkTo = '/',
}) => {
  return (
    <div className="min-h-screen w-full bg-[#FAF9F6] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1E293B] text-center mb-2">
            {title}
          </h1>
          <p className="text-sm text-[#94A3B8] text-center">
            {subtitle}
          </p>
        </div>

        {children}

        {footerText && footerLinkText && (
          <p className="text-center text-sm mt-6 text-[#94A3B8]">
            {footerText}{' '}
            <Link
              to={footerLinkTo}
              className="text-sm text-[#64748B] hover:text-[#4A5568] font-medium"
            >
              {footerLinkText}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthLayout;
