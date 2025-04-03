import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import SidebarItem from "./Sidebar/SidebarItem";
import SidebarLogo from "./Sidebar/SidebarLogo";
import SidebarProfile from "./Sidebar/SidebarProfile";
import SidebarActions from "./Sidebar/SidebarActions";
import sidebarItems from "./Sidebar/sidebarItems";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { checkWaitlistStatus } from "@/services/waitlistService";

const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [items, setItems] = useState(sidebarItems);
  const location = useLocation();
  const { user } = useAuth();

  // Re-evaluate sidebar items when component mounts, route changes, or user changes
  useEffect(() => {
    const updateSidebarItems = async () => {
      // Check localStorage first for not interested status
      const hidePersonas = localStorage.getItem("hidePersonasSidebar") === "true";
      
      // Create a new array instead of modifying the existing one
      let updatedItems = [...sidebarItems];
      
      // If the user is not interested, apply that preference
      if (hidePersonas) {
        updatedItems = updatedItems.map(item => ({
          ...item,
          hidden: item.name === "Personas" ? true : item.hidden
        }));
        
        setItems(updatedItems);
        return;
      }
      
      // Otherwise check waitlist status if user is logged in
      if (user) {
        try {
          // No need to check waitlist status to determine visibility
          // We'll always show Personas unless explicitly hidden by "not interested"
          updatedItems = updatedItems.map(item => ({
            ...item,
            hidden: item.name === "Personas" ? false : item.hidden
          }));
          
          setItems(updatedItems);
        } catch (error) {
          console.error("Error checking waitlist status:", error);
        }
      }
    };
    
    updateSidebarItems();
  }, [location.pathname, user]);

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <TooltipProvider>
      <div 
        className={`h-screen bg-white dark:bg-gray-900 border-r dark:border-gray-800 flex flex-col transition-all duration-300 ${
          collapsed ? "w-[70px]" : "w-[250px]"
        } sticky left-0 top-0`}
      >
        {/* Logo */}
        <SidebarLogo collapsed={collapsed} />

        <Separator className="mb-4" />
        
        {/* Navigation */}
        <div className="px-3 py-2 flex-1">
          <nav className="space-y-2">
            {items.filter(item => !item.hidden).map((item) => (
              <SidebarItem 
                key={item.path}
                name={item.name}
                path={item.path}
                icon={item.icon}
                collapsed={collapsed}
                badge={item.badge}
                showNotificationBadge={item.showNotificationBadge}
              />
            ))}
          </nav>
        </div>

        {/* Bottom section with collapse, theme toggle */}
        <div className="mt-auto space-y-2 px-3 py-2">
          <SidebarActions 
            collapsed={collapsed} 
            toggleSidebar={toggleSidebar}
          />
        </div>

        {/* User Profile */}
        <div className="p-4 border-t dark:border-gray-800">
          <SidebarProfile collapsed={collapsed} />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default DashboardSidebar;
