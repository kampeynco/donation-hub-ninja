
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
import { supabase } from "@/integrations/supabase/client";

const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [items, setItems] = useState(sidebarItems);
  const location = useLocation();
  const { user } = useAuth();

  // Log the current location
  useEffect(() => {
    console.log("DashboardSidebar: Current location path:", location.pathname);
  }, [location.pathname]);

  // Fetch feature flags from database
  const fetchFeatures = useCallback(async () => {
    if (!user) return;

    try {
      // Get features from the database
      const { data, error } = await supabase
        .from('features')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle(); // Use maybeSingle instead of limit(1)
      
      if (error) {
        console.error('Error fetching features:', error);
        return;
      }
      
      if (!data) {
        console.log('No features found for sidebar. Using default visibility.');
        return;
      }
      
      // Create a new array of sidebar items with visibility based on features
      const updatedItems = sidebarItems.map(item => {
        // Hide Personas from sidebar navigation if feature is disabled
        if (item.name === "Personas") {
          return {
            ...item,
            hidden: !data.personas
          };
        }
        // Hide Universe from sidebar navigation if feature is disabled
        if (item.name === "Universe") {
          return {
            ...item,
            hidden: !data.universe
          };
        }
        return item;
      });
      
      setItems(updatedItems);
    } catch (err) {
      console.error('Unexpected error fetching features:', err);
    }
  }, [user]);

  // Set up realtime subscription for features
  useEffect(() => {
    if (!user?.id) return;

    let isMounted = true;

    const channel = supabase
      .channel('sidebar-features-changes')
      .on(
        'postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'features',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          if (!isMounted) return;
          fetchFeatures();
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchFeatures]);

  // Re-evaluate sidebar items when component mounts, route changes, or user changes
  useEffect(() => {
    fetchFeatures();
  }, [location.pathname, user, fetchFeatures]);

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
