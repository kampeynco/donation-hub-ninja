
import { useState, useEffect, useCallback } from "react";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import SidebarItem from "./Sidebar/SidebarItem";
import SidebarLogo from "./Sidebar/SidebarLogo";
import SidebarProfile from "./Sidebar/SidebarProfile";
import SidebarActions from "./Sidebar/SidebarActions";
import sidebarItems from "./Sidebar/sidebarItems";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { 
  checkWaitlistStatus, 
  getFeatureVisibilityPreference,
  FeatureName
} from "@/services/waitlistService";

const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [items, setItems] = useState(sidebarItems);
  const location = useLocation();
  const { user } = useAuth();

  // Re-evaluate sidebar items when component mounts, route changes, or user changes
  useEffect(() => {
    const updateSidebarItems = async () => {
      if (!user) return;
      
      // Create a new array instead of modifying the existing one
      const updatedItems = [...sidebarItems];
      
      // Check Personas feature status
      const featureName = "Personas" as FeatureName;
      const waitlistStatus = await checkWaitlistStatus(featureName, user.id);
      const hidePreference = getFeatureVisibilityPreference(featureName);
      
      for (let i = 0; i < updatedItems.length; i++) {
        if (updatedItems[i].name === featureName) {
          // Hide based on preference or if declined
          const shouldHide = hidePreference || waitlistStatus?.status === "declined";
          
          // Only show if approved or not hidden by preference
          updatedItems[i] = {
            ...updatedItems[i],
            hidden: shouldHide
          };
        }
      }
      
      // Only update state if items are different to prevent unnecessary renders
      if (JSON.stringify(updatedItems) !== JSON.stringify(items)) {
        setItems(updatedItems);
      }
    };
    
    updateSidebarItems();
  }, [location.pathname, user]);

  const toggleSidebar = useCallback(() => setCollapsed(prev => !prev), []);

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
