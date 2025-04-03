
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NotificationsProvider } from "@/context/NotificationsContext";
import DashboardSidebar from "./DashboardSidebar";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { PageLoader } from "@/components/ui/page-loader";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayedChildren, setDisplayedChildren] = useState(children);
  const [isLoading, setIsLoading] = useState(true);

  // Manage smooth transitions between routes
  useEffect(() => {
    let isMounted = true;
    
    // Start transitioning when route changes
    if (children !== displayedChildren) {
      setIsTransitioning(true);
      
      // After a short delay, update the displayed content
      const timer = setTimeout(() => {
        if (isMounted) {
          setDisplayedChildren(children);
          setIsTransitioning(false);
        }
      }, 200);
      
      return () => {
        isMounted = false;
        clearTimeout(timer);
      };
    }
    
    return () => { isMounted = false; };
  }, [children, displayedChildren]);

  // Simulate initial load time for consistent experience
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Prefetch feature status when component mounts
  useEffect(() => {
    // Importing dynamically to avoid circular dependencies
    import("@/hooks/useFeatureCache").then(({ useFeatureCache }) => {
      const { refreshCache } = useFeatureCache();
      refreshCache();
    });
  }, []);

  return (
    <TooltipProvider>
      <NotificationsProvider>
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
          <DashboardSidebar />
          <main className="flex-1 transition-all duration-300">
            <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
              {isLoading ? (
                <PageLoader />
              ) : (
                <div 
                  className={`transition-opacity duration-300 ${
                    isTransitioning ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  {displayedChildren}
                </div>
              )}
            </div>
          </main>
          <Toaster />
        </div>
      </NotificationsProvider>
    </TooltipProvider>
  );
};

export default Layout;
