
import { useState, useEffect, useCallback, useRef } from "react";
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
  const fetchInProgressRef = useRef(false);
  const lastRefreshTimeRef = useRef(0);

  // Log the current location
  useEffect(() => {
    console.log("DashboardSidebar: Current location path:", location.pathname);
  }, [location.pathname]);

  // Fetch feature flags from database with throttling and debouncing
  const fetchFeatures = useCallback(async () => {
    if (!user) {
      console.log("DashboardSidebar: No user, skipping features fetch");
      return;
    }

    // Prevent concurrent fetches
    if (fetchInProgressRef.current) {
      console.log("DashboardSidebar: Feature fetch already in progress, skipping");
      return;
    }
    
    const now = Date.now();
    if (now - lastRefreshTimeRef.current < 2000) {
      console.log("DashboardSidebar: Too soon to fetch features again, skipping");
      return;
    }
    
    try {
      console.log(`DashboardSidebar: Fetching features for user ${user.id.substring(0, 8)}`);
      fetchInProgressRef.current = true;
      lastRefreshTimeRef.current = now;
      
      // Get features from the database
      const { data, error } = await supabase
        .from('features')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('DashboardSidebar: Error fetching features:', error);
        return;
      }
      
      if (!data) {
        console.log('DashboardSidebar: No features found. Using default visibility.');
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
      
      console.log("DashboardSidebar: Features updated successfully", { 
        personas: data.personas, 
        universe: data.universe 
      });
      
      setItems(updatedItems);
    } catch (err) {
      console.error('DashboardSidebar: Unexpected error fetching features:', err);
    } finally {
      fetchInProgressRef.current = false;
    }
  }, [user]);

  // Set up realtime subscription for features - only once when component mounts
  useEffect(() => {
    if (!user?.id) return;

    console.log(`DashboardSidebar: Setting up realtime subscription for user ${user.id.substring(0, 8)}`);
    
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
        (payload) => {
          if (!isMounted) return;
          console.log('DashboardSidebar: Feature change detected via realtime:', payload);
          fetchFeatures();
        }
      )
      .subscribe();

    // Initial fetch
    fetchFeatures();

    return () => {
      console.log('DashboardSidebar: Cleaning up realtime subscription');
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchFeatures]);

  // Fetch features when component mounts
  useEffect(() => {
    if (user?.id) {
      fetchFeatures();
    }
  }, [user?.id, fetchFeatures]);

  const toggleSidebar = useCallback(() => {
    setCollapsed(prev => !prev);
    console.log(`DashboardSidebar: Sidebar ${collapsed ? 'expanded' : 'collapsed'}`);
  }, [collapsed]);

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
