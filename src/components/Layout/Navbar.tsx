import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IconMenu2, IconX, IconStarFilled } from "@tabler/icons-react";
import NotificationBell from '@/components/Notifications/NotificationBell';

const Navbar = () => {
  const {
    user,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  const handleSignOut = async () => {
    await signOut();
    navigate("/auth/signin");
  };
  const getInitials = () => {
    const email = user?.email || "";
    return email.substring(0, 2).toUpperCase();
  };
  const getUserDisplayName = () => {
    return user?.user_metadata?.committee_name || "Demo Committee";
  };
  return <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="container max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl">
            <div className="bg-[#007AFF] text-white p-2 rounded-full w-10 h-10 flex items-center justify-center">
              <IconStarFilled size={24} color="white" />
            </div>
            <span>Donor Camp</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            
            {user ? <>
                <div className="hidden md:flex items-center space-x-4">
                  <NotificationBell />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-10 w-10 p-0 rounded-full">
                        <Avatar className="h-10 w-10 border-2 border-gray-200">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 rounded-lg" align="end" forceMount>
                      <div className="p-4 border-b">
                        <p className="text-lg font-semibold">{getUserDisplayName()}</p>
                        <p className="text-gray-500 text-sm">{user?.email}</p>
                      </div>
                      <div className="p-2">
                        <DropdownMenuItem asChild className="py-2">
                          <Link to="/account" className="w-full cursor-pointer">
                            Account settings
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="py-2 cursor-pointer">
                          Help & support
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleSignOut} className="py-2 text-red-500 cursor-pointer">
                          Sign out
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </> : <Link to="/auth/signin" className="text-gray-600 hover:text-gray-800">
                Login
              </Link>}
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <IconX className="h-6 w-6" /> : <IconMenu2 className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && <div className="md:hidden bg-gray-50 py-2 border-b">
          <div className="container max-w-7xl mx-auto flex flex-col space-y-2 px-4 sm:px-6 lg:px-8">
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-800" onClick={closeMobileMenu}>
              Dashboard
            </Link>
            {user ? <>
                <div className="md:hidden flex items-center space-x-2">
                  <NotificationBell />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-10 w-10 p-0 rounded-full">
                        <Avatar className="h-10 w-10 border-2 border-gray-200">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 rounded-lg" align="end" forceMount>
                      <div className="p-4 border-b">
                        <p className="text-lg font-semibold">{getUserDisplayName()}</p>
                        <p className="text-gray-500 text-sm">{user?.email}</p>
                      </div>
                      <div className="p-2">
                        <DropdownMenuItem asChild className="py-2">
                          <Link to="/account" className="w-full cursor-pointer">
                            Account settings
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="py-2 cursor-pointer">
                          Help & support
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleSignOut} className="py-2 text-red-500 cursor-pointer">
                          Sign out
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </> : <Link to="/auth/signin" className="text-gray-600 hover:text-gray-800" onClick={closeMobileMenu}>
                Login
              </Link>}
          </div>
        </div>}
    </nav>;
};
export default Navbar;
