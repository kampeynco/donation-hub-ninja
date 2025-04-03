
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Logo mark image from assets bucket
const DARK_LOGO_MARK = "https://igjnhwvtasegwyiwcdkr.supabase.co/storage/v1/object/public/assets/images/updated_dc_logomark_dark.png";

const HomeHeader = () => {
  return (
    <div className="bg-white text-gray-900 container mx-auto px-4 py-4 md:py-6 flex justify-between items-center border-b border-gray-100">
      <Link to="/" className="flex items-center gap-2">
        <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-primary">
          <img src={DARK_LOGO_MARK} alt="Donor Camp Logo" className="w-[1.75rem] h-[1.75rem]" />
        </div>
        <span className="text-base md:text-lg font-semibold tracking-tight">Donor Camp</span>
      </Link>
      <div className="flex gap-2 md:gap-4">
        <Link to="/auth/signin">
          <Button variant="ghost" className="text-gray-700 hover:bg-gray-100 text-xs md:text-sm py-1 md:py-2 px-2 md:px-4">
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
  );
};

export default HomeHeader;
