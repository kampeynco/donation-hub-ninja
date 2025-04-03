
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NotificationsProvider } from "@/context/NotificationsContext";
import DashboardSidebar from "./DashboardSidebar";
import { useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { refreshFeatureCache } from "@/hooks/useFeatureCache";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayedChildren, setDisplayedChildren] = useState(children);
  const initialRenderRef = useRef(true);
  const lastRefreshTimeRef = useRef(0);
  const currentPathRef = useRef(location.pathname);

  // Manage smooth transitions between routes
  useEffect(() => {
    let isMounted = true;
    
    // Skip transition on initial render
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      setDisplayedChildren(children);
      return;
    }
    
    // Only transition if we're actually changing content
    if (children !== displayedChildren) {
      setIsTransitioning(true);
      
      // After a short delay, update the displayed content
      const timer = setTimeout(() => {
        if (isMounted) {
          setDisplayedChildren(children);
          // Slight delay before showing the new content
          setTimeout(() => {
            if (isMounted) {
              setIsTransitioning(false);
            }
          }, 50);
        }
      }, 150);
      
      return () => {
        isMounted = false;
        clearTimeout(timer);
      };
    }
    
    return () => { isMounted = false; };
  }, [children, displayedChildren]);

  // Refresh feature status on significant route changes (avoiding duplicate refreshes)
  useEffect(() => {
    const refreshFeatures = async () => {
      // Only refresh if user exists and path has actually changed
      if (!user?.id || currentPathRef.current === location.pathname) {
        return;
      }
      
      const now = Date.now();
      // Limit refreshes to once every 1000ms to prevent race conditions
      if (now - lastRefreshTimeRef.current < 1000) {
        console.log(`[Layout] Skipping feature refresh for ${location.pathname} (too soon)`);
        return;
      }
      
      console.log(`[Layout] Route changed from ${currentPathRef.current} to ${location.pathname}, refreshing features for user ${user.id.substring(0, 8)}`);
      
      // Update refs before the async operation
      currentPathRef.current = location.pathname;
      lastRefreshTimeRef.current = now;
      
      const result = await refreshFeatureCache(user.id);
      console.log(`[Layout] Feature refresh result:`, result);
    };
    
    refreshFeatures();
  }, [user?.id, location.pathname]);

  return (
    <TooltipProvider>
      <NotificationsProvider>
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
          <DashboardSidebar />
          <main className="flex-1 transition-all duration-300">
            <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
              <div 
                className={`transition-opacity duration-300 ${
                  isTransitioning ? 'opacity-0' : 'opacity-100'
                }`}
              >
                {displayedChildren}
              </div>
            </div>
          </main>
          <Toaster />
        </div>
      </NotificationsProvider>
    </TooltipProvider>
  );
};

export default Layout;
