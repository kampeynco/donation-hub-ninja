
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Logo mark image from assets bucket
const DARK_LOGO_MARK = "https://igjnhwvtasegwyiwcdkr.supabase.co/storage/v1/object/public/assets//updated_dc_logomark_dark.png";

const HomeHeader = () => {
  return (
    <div className="container mx-auto px-4 py-4 md:py-6 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2">
        <div className="flex h-10 md:h-12 w-10 md:w-12 items-center justify-center rounded-full bg-primary/10">
          <img src={DARK_LOGO_MARK} alt="Donor Camp Logo" className="w-5 md:w-6 h-5 md:h-6" />
        </div>
        <span className="text-lg md:text-xl font-semibold tracking-tight">Donor Camp</span>
      </Link>
      <div className="flex gap-2 md:gap-4">
        <Link to="/auth/signin">
          <Button variant="ghost" className="text-primary hover:bg-gray-100 text-sm md:text-base py-1 md:py-2 px-2 md:px-4">
            Log in
          </Button>
        </Link>
        <Link to="/auth/signup">
          <Button className="bg-primary text-white hover:bg-primary/90 text-sm md:text-base py-1 md:py-2 px-2 md:px-4">
            Get started
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HomeHeader;
