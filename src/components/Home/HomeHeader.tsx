
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Logo mark image from assets bucket
const DARK_LOGO_MARK = "https://igjnhwvtasegwyiwcdkr.supabase.co/storage/v1/object/public/assets//updated_dc_logomark_dark.png";

const HomeHeader = () => {
  return (
    <div className="bg-primary text-primary-foreground container mx-auto px-4 py-4 md:py-6 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2">
        <div className="flex h-9 md:h-10 w-9 md:w-10 items-center justify-center rounded-full bg-white/10">
          <img src={DARK_LOGO_MARK} alt="Donor Camp Logo" className="w-4 md:w-5 h-4 md:h-5" />
        </div>
        <span className="text-base md:text-lg font-semibold tracking-tight">Donor Camp</span>
      </Link>
      <div className="flex gap-2 md:gap-4">
        <Link to="/auth/signin">
          <Button variant="ghost" className="text-white hover:bg-white/10 text-xs md:text-sm py-1 md:py-2 px-2 md:px-4">
            Log in
          </Button>
        </Link>
        <Link to="/auth/signup">
          <Button className="bg-white text-primary hover:bg-white/90 text-xs md:text-sm py-1 md:py-2 px-2 md:px-4">
            Get started
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HomeHeader;
