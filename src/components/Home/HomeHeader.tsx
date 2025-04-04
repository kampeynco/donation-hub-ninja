
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Logo mark image from assets bucket
const LIGHT_LOGO_MARK = "https://igjnhwvtasegwyiwcdkr.supabase.co/storage/v1/object/public/assets/images/updated_dc_logomark_light.png";

const HomeHeader = () => {
  return (
    <header className="w-full bg-transparent text-gray-900 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-3 md:py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 md:h-[2.5rem] md:w-[2.5rem] items-center justify-center rounded-full bg-primary">
            <img src={LIGHT_LOGO_MARK} alt="Donor Camp Logo" className="w-6 h-6 md:w-[1.75rem] md:h-[1.75rem]" />
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
