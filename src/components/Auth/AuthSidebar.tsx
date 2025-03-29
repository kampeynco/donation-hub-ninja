
import { Link } from "react-router-dom";
import { IconStar } from "@tabler/icons-react";

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
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
            <IconStar size={24} stroke={2} color="#007AFF" />
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
