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
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FAF9F6]">
      <div className="w-full max-w-sm mx-auto bg-white rounded-3xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-[#4A5568]">
            EmpathAI
          </h1>
          <h2 className="text-lg font-semibold mb-1 text-[#4A5568]">
            {title}
          </h2>
          <p className="text-sm text-[#94A3B8]">
            {subtitle}
          </p>
        </div>

        {children}

        {footerText && footerLinkText && (
          <p className="text-center text-sm mt-6 text-[#94A3B8]">
            {footerText}{' '}
            <Link
              to={footerLinkTo}
              className="font-medium text-[#8FA697] hover:underline underline-offset-2"
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
