import { Link } from 'react-router-dom';

const AuthLayout = ({
  children,
  title,
  subtitle,
  logo,
  footerText = '',
  footerLinkText = '',
  footerLinkTo = '/',
}) => {
  return (
    <div className="min-h-screen w-full bg-bg-main flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-[400px] bg-white rounded-[2.5rem] px-6 py-10 sm:p-10 shadow-sm mx-auto">
        
        {logo && (
          <div className="flex justify-center mb-6">
            {logo}
          </div>
        )}

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1E293B] mb-2">
            {title}
          </h1>
          <p className="text-sm text-text-secondary">
             {subtitle}
          </p>
        </div>

        {children}

        {footerText && footerLinkText && (
          <p className="text-center text-[13px] mt-6 text-text-secondary">
            {footerText}{' '}
            <Link
              to={footerLinkTo}
              className="font-bold text-text-interactive hover:text-text-primary ml-1"
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
