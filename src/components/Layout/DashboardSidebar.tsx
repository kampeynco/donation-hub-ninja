
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  IconDashboard, 
  IconUsers, 
  IconCreditCard, 
  IconReportMoney, 
  IconSun, 
  IconMoon, 
  IconStarFilled,
  IconChevronLeft
} from "@tabler/icons-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type SidebarItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
};

const sidebarItems: SidebarItem[] = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <IconDashboard className="h-5 w-5" />,
  },
  {
    name: "Donors",
    path: "/donors",
    icon: <IconUsers className="h-5 w-5" />,
  },
  {
    name: "Donations",
    path: "/donations",
    icon: <IconCreditCard className="h-5 w-5" />,
  },
  {
    name: "Reports",
    path: "/reports",
    icon: <IconReportMoney className="h-5 w-5" />,
  },
];

const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const toggleSidebar = () => setCollapsed(!collapsed);

  const getInitials = () => {
    const email = user?.email || "";
    return email.substring(0, 2).toUpperCase();
  };

  const getUserDisplayName = () => {
    return user?.user_metadata?.committee_name || "Demo Committee";
  };

  return (
    <div 
      className={`h-screen bg-white dark:bg-gray-900 border-r dark:border-gray-800 flex flex-col transition-all duration-300 ${
        collapsed ? "w-[70px]" : "w-[250px]"
      } sticky left-0 top-0`}
    >
      {/* Logo */}
      <div className="p-4 flex items-center">
        <div className="bg-donor-blue text-white p-2 rounded-full w-10 h-10 flex items-center justify-center shrink-0">
          <IconStarFilled size={16} />
        </div>
        {!collapsed && <span className="ml-3 font-bold text-lg">Donor Camp</span>}
      </div>

      {/* Collapse button */}
      <div className="px-4 mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-between items-center"
          onClick={toggleSidebar}
        >
          {!collapsed && <span>Collapse</span>}
          <IconChevronLeft className={`h-5 w-5 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </Button>
      </div>

      <Separator className="mb-4" />
      
      {/* Navigation */}
      <div className="px-3 py-2 flex-1">
        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <Tooltip key={item.path} delayDuration={0}>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md transition-colors ${
                      isActive
                        ? "bg-donor-blue text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    } ${collapsed ? "justify-center" : ""}`
                  }
                >
                  {item.icon}
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                </NavLink>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">
                  {item.name}
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </nav>
      </div>

      <Separator className="my-2" />

      {/* Theme Toggle */}
      <div className="px-3 py-2">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`${collapsed ? "justify-center w-full" : "w-full justify-between"}`}
              onClick={toggleTheme}
            >
              {theme === "light" ? (
                <IconMoon className="h-5 w-5" />
              ) : (
                <IconSun className="h-5 w-5" />
              )}
              {!collapsed && <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>}
            </Button>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right">
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </TooltipContent>
          )}
        </Tooltip>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t dark:border-gray-800">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <div className={`flex ${collapsed ? "justify-center" : "items-center"}`}>
              <Avatar className="h-9 w-9 border-2 border-gray-200">
                <AvatarFallback className="bg-donor-blue text-white">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="ml-3">
                  <p className="text-sm font-medium">{getUserDisplayName()}</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto p-0 text-xs text-gray-500 hover:text-red-500"
                    onClick={signOut}
                  >
                    Sign out
                  </Button>
                </div>
              )}
            </div>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right" className="flex flex-col gap-2 p-2">
              <p className="text-sm font-medium">{getUserDisplayName()}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs text-gray-500 hover:text-red-500"
                onClick={signOut}
              >
                Sign out
              </Button>
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </div>
  );
};

export default DashboardSidebar;
