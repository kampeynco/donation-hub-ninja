
import { Link } from "react-router-dom";
import { Bell, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
                <Link to="/account" className="border-b-2 border-transparent pb-4 text-sm font-medium text-gray-500 hover:text-gray-900">
                  Account
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">3</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="border-b p-4">
                <p className="font-medium">Notifications</p>
              </div>
              <div className="max-h-80 overflow-auto">
                <div className="border-b p-4 hover:bg-gray-50">
                  <p className="font-medium">New donation received</p>
                  <p className="text-sm text-gray-500">John Doe donated $50.00</p>
                  <p className="text-xs text-gray-400">2 minutes ago</p>
                </div>
                <div className="border-b p-4 hover:bg-gray-50">
                  <p className="font-medium">New donation received</p>
                  <p className="text-sm text-gray-500">Jane Smith donated $25.00</p>
                  <p className="text-xs text-gray-400">1 hour ago</p>
                </div>
                <div className="p-4 hover:bg-gray-50">
                  <p className="font-medium">New donor joined</p>
                  <p className="text-sm text-gray-500">Mike Johnson created an account</p>
                  <p className="text-xs text-gray-400">Yesterday</p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary text-primary-foreground">JS</AvatarFallback>
                </Avatar>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 p-0">
              <div className="border-b p-4">
                <p className="font-medium">John Smith</p>
                <p className="text-sm text-gray-500">john@example.com</p>
              </div>
              <div className="p-2">
                <Link to="/account" className="block rounded px-2 py-1.5 text-sm hover:bg-gray-100">
                  Account settings
                </Link>
                <Link to="/" className="block rounded px-2 py-1.5 text-sm hover:bg-gray-100">
                  Help & support
                </Link>
                <button className="block w-full rounded px-2 py-1.5 text-left text-sm text-red-600 hover:bg-gray-100">
                  Sign out
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
