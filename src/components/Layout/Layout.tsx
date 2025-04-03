
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

  // Manage smooth transitions between routes
  useEffect(() => {
    let isMounted = true;
    
    // Skip transition on initial render
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      setDisplayedChildren(children);
      return;
    }
    
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

  // Aggressively refresh feature status on each route change
  useEffect(() => {
    const refreshFeatures = async () => {
      if (user?.id) {
        console.log(`[Layout] Route changed to ${location.pathname}, refreshing features for user ${user.id.substring(0, 8)}`);
        const result = await refreshFeatureCache(user.id);
        console.log(`[Layout] Feature refresh result:`, result);
      }
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
