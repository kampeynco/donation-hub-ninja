
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NotificationsProvider } from "@/context/NotificationsContext";
import DashboardSidebar from "./DashboardSidebar";
import { useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { PageLoader } from "@/components/ui/page-loader";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayedChildren, setDisplayedChildren] = useState(children);
  const initialRenderRef = useRef(true);

  // Prefetch feature status when component mounts
  useEffect(() => {
    // Importing dynamically to avoid circular dependencies
    import("@/hooks/useFeatureCache").then(({ useFeatureCache }) => {
      const { refreshCache } = useFeatureCache();
      refreshCache();
    });
  }, []);

  // Manage smooth transitions between routes
  useEffect(() => {
    let isMounted = true;
    
    // Skip animation on initial render
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      setDisplayedChildren(children);
      return;
    }
    
    // Start transitioning when route changes
    if (children !== displayedChildren) {
      setIsTransitioning(true);
      
      // After a very short delay, update the displayed content
      const timer = setTimeout(() => {
        if (isMounted) {
          setDisplayedChildren(children);
          // Give DOM time to update, then fade in
          requestAnimationFrame(() => {
            if (isMounted) {
              setIsTransitioning(false);
            }
          });
        }
      }, 100); // Reduced from 200ms to 100ms for faster transitions
      
      return () => {
        isMounted = false;
        clearTimeout(timer);
      };
    }
    
    return () => { isMounted = false; };
  }, [children, displayedChildren]);

  return (
    <TooltipProvider>
      <NotificationsProvider>
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
          <DashboardSidebar />
          <main className="flex-1 transition-all duration-300">
            <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
              <div 
                className={`transition-opacity duration-200 ${
                  isTransitioning ? 'opacity-70' : 'opacity-100'
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
