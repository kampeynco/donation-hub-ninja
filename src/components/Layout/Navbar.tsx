import { Link } from "react-router-dom";
import { IconBell } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
const Navbar = () => {
  // Define initial notifications
  const initialNotifications = [{
    id: 1,
    message: "John Doe donated $50.00",
    timestamp: "2 minutes ago"
  }, {
    id: 2,
    message: "Jane Smith donated $25.00",
    timestamp: "1 hour ago"
  }, {
    id: 3,
    message: "Mike Johnson created an account",
    timestamp: "Yesterday"
  }];

  // State to manage notifications
  const [notifications, setNotifications] = useState(initialNotifications);
  const {
    user,
    signOut
  } = useAuth();

  // Function to remove a notification
  const removeNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  // Function to mark all notifications as read
  const markAllAsRead = () => {
    setNotifications([]);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.email) return "U";
    const email = user.email;
    return email.substring(0, 2).toUpperCase();
  };
  return <header className="border-b bg-white shadow-sm">
      <div className="container max-w-7xl mx-auto flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white" />
              </svg>
            </div>
            <span className="text-xl font-semibold tracking-tight">Donor Camp</span>
          </Link>
          <nav className="hidden md:flex">
            <ul className="flex gap-8">
              <li>
                <Link to="/dashboard" className="border-b-2 border-transparent pb-4 text-sm font-medium text-gray-500 hover:text-gray-900">
                  Donors
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center gap-5">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-gray-100">
                <IconBell className="h-5 w-5 text-gray-600" />
                {notifications.length > 0 && <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                    {notifications.length}
                  </span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0 rounded-xl shadow-lg border-gray-200">
              <div className="border-b p-4 flex justify-between items-center">
                <p className="font-medium">Notifications</p>
                {notifications.length > 0 && <button onClick={markAllAsRead} className="text-xs text-primary hover:underline">
                    Mark all as read
                  </button>}
              </div>
              <div className="max-h-80 overflow-auto">
                {notifications.length > 0 ? notifications.map(notification => <div key={notification.id} className="border-b p-4 hover:bg-gray-50 relative">
                      <button onClick={() => removeNotification(notification.id)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                        <X size={14} />
                      </button>
                      <p className="text-sm text-gray-700 pr-5">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{notification.timestamp}</p>
                    </div>) : <div className="p-4 text-center">
                    <p className="text-sm text-gray-500">No notifications</p>
                  </div>}
              </div>
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
                <Avatar className="h-9 w-9 border-2 border-gray-200">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary text-primary-foreground">{getUserInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 p-0 rounded-xl shadow-lg border-gray-200">
              <div className="border-b p-4">
                <p className="font-medium">{user?.email || "User"}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              <div className="p-2">
                <Link to="/account" className="block rounded-lg px-2 py-1.5 text-sm hover:bg-gray-100">
                  Account settings
                </Link>
                <Link to="/" className="block rounded-lg px-2 py-1.5 text-sm hover:bg-gray-100">
                  Help & support
                </Link>
                <button onClick={signOut} className="block w-full rounded-lg px-2 py-1.5 text-left text-sm text-red-600 hover:bg-gray-100">
                  Sign out
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>;
};
export default Navbar;