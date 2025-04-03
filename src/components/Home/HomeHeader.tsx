
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Logo mark image from assets bucket
const DARK_LOGO_MARK = "https://igjnhwvtasegwyiwcdkr.supabase.co/storage/v1/object/public/assets//updated_dc_logomark_dark.png";

const HomeHeader = () => {
  return (
    <div className="container mx-auto px-4 py-6 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <img src={DARK_LOGO_MARK} alt="Donor Camp Logo" className="w-6 h-6" />
        </div>
        <span className="text-xl font-semibold tracking-tight">Donor Camp</span>
      </Link>
      <div className="flex gap-4">
        <Link to="/auth/signin">
          <Button variant="ghost" className="text-primary hover:bg-gray-100">
            Log in
          </Button>
        </Link>
        <Link to="/auth/signup">
          <Button className="bg-primary text-white hover:bg-primary/90">
            Get started
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HomeHeader;
