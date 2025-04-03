
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
import { useFeatureCache } from "@/hooks/useFeatureCache";

const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [items, setItems] = useState(sidebarItems);
  const location = useLocation();
  const { user } = useAuth();
  const { hasFeature, isLoading, featureCache } = useFeatureCache();

  // Update sidebar items based on feature flags
  useEffect(() => {
    // Skip if still loading or no cache data
    if (isLoading || Object.keys(featureCache).length === 0) return;
    
    // Create a new array of sidebar items with visibility based on features
    const updatedItems = sidebarItems.map(item => {
      // Hide Personas from sidebar navigation if feature is disabled
      if (item.name === "Personas") {
        return {
          ...item,
          hidden: !hasFeature("personas")
        };
      }
      // Hide Universe from sidebar navigation if feature is disabled
      if (item.name === "Universe") {
        return {
          ...item,
          hidden: !hasFeature("universe")
        };
      }
      return item;
    });
    
    setItems(updatedItems);
  }, [hasFeature, isLoading, featureCache]);

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
