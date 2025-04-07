
import { Link } from "react-router-dom";

// Logo mark image from assets bucket - always use the white version on the sidebar since it has a dark background
const DARK_LOGO_MARK = "https://igjnhwvtasegwyiwcdkr.supabase.co/storage/v1/object/public/assets/images/flame_logomark_white.png";

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
  return <div className="hidden md:flex md:w-1/2 bg-primary flex-col items-center justify-center text-white p-10">
      <div className="max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <div className="flex h-[2.8rem] w-[2.8rem] items-center justify-center">
            <img src={DARK_LOGO_MARK} alt="Donor Camp Logo" className="w-full h-full" />
          </div>
          <span className="text-xl font-semibold tracking-tight">Donor Camp</span>
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
    </div>;
};
export default AuthSidebar;
