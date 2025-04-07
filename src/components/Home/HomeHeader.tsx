
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";

// Logo mark images from assets bucket
const LIGHT_LOGO_MARK = "https://igjnhwvtasegwyiwcdkr.supabase.co/storage/v1/object/public/assets/images/flame_logomark_blue.png";
const DARK_LOGO_MARK = "https://igjnhwvtasegwyiwcdkr.supabase.co/storage/v1/object/public/assets/images/flame_logomark_white.png";

const HomeHeader = () => {
  const { theme } = useTheme();
  const logoSrc = theme === "dark" ? DARK_LOGO_MARK : LIGHT_LOGO_MARK;

  return (
    <header className="w-full bg-transparent text-gray-900 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-3 md:py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center">
            <img src={logoSrc} alt="Donor Camp Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-base md:text-lg font-semibold tracking-tight">Donor Camp</span>
        </Link>
        <div className="flex gap-2 md:gap-4">
          <Link to="/auth/signin">
            <Button variant="ghost" className="text-gray-700 hover:bg-gray-100/70 text-xs md:text-sm py-1 md:py-2 px-2 md:px-4">
              Log in
            </Button>
          </Link>
          <Link to="/auth/signup">
            <Button className="bg-primary text-white hover:bg-primary/90 text-xs md:text-sm py-1 md:py-2 px-2 md:px-4">
              Get started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
