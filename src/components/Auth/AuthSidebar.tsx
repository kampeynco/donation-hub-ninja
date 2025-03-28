
import { Link } from "react-router-dom";

interface AuthSidebarProps {
  title: string;
  description: string;
  linkText: string;
  linkUrl: string;
  linkLabel: string;
}

const AuthSidebar: React.FC<AuthSidebarProps> = ({ 
  title,
  description,
  linkText,
  linkUrl,
  linkLabel
}) => {
  return (
    <div className="hidden md:flex md:w-1/2 bg-primary flex-col items-center justify-center text-white p-10">
      <div className="max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#2563EB" />
            </svg>
          </div>
          <span className="text-xl font-semibold tracking-tight">DonorCamp</span>
        </Link>
        
        <h1 className="text-4xl font-bold mb-6">{title}</h1>
        <p className="text-lg mb-10">{description}</p>
        
        <div className="mt-10">
          <p>
            {linkLabel}{" "}
            <Link to={linkUrl} className="text-white underline font-medium">
              {linkText}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthSidebar;
