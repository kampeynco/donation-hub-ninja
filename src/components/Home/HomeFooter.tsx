
import { Link } from "react-router-dom";

// Logo mark image from assets bucket
const DARK_LOGO_MARK = "https://igjnhwvtasegwyiwcdkr.supabase.co/storage/v1/object/public/assets/images/dc_logomark_main.png";

const HomeFooter = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 md:py-10 lg:py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <Link to="/" className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="flex h-[2.8rem] w-[2.8rem] items-center justify-center">
              <img src={DARK_LOGO_MARK} alt="Donor Camp Logo" className="w-full h-full" />
            </div>
            <span className="text-base md:text-lg font-semibold tracking-tight">Donor Camp</span>
          </Link>
          <div className="text-gray-400 text-xs md:text-sm">
            © {new Date().getFullYear()} Donor Camp. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
