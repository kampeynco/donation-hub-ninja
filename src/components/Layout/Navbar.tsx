
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <header className="border-b bg-white">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white" />
              </svg>
            </div>
            <span className="text-xl font-bold">DonorCamp</span>
          </Link>
          <nav className="hidden md:flex">
            <ul className="flex gap-6">
              <li>
                <Link to="/dashboard" className="border-b-2 border-primary pb-4 text-sm font-medium text-primary">
                  Donors
                </Link>
              </li>
              <li>
                <Link to="/editor" className="border-b-2 border-transparent pb-4 text-sm font-medium text-gray-500 hover:text-gray-900">
                  Editor
                </Link>
              </li>
              <li>
                <Link to="/account" className="border-b-2 border-transparent pb-4 text-sm font-medium text-gray-500 hover:text-gray-900">
                  Account
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div>
          <Button size="sm" className="rounded">
            Embed My DonorCamp
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
