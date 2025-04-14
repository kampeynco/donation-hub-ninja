
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NotificationsProvider } from "@/context/NotificationsContext";
import { useEffect } from "react";
import { useFeatureCache } from "@/hooks/useFeatureCache";
import NestedSidebar from "@/components/Layout/NestedSidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // Get the refreshCache function from the hook
  const { refreshCache } = useFeatureCache();
  
  // Prefetch feature status when component mounts
  useEffect(() => {
    // Call refreshCache from the hook instance we created above
    refreshCache();
  }, [refreshCache]); // Add refreshCache to the dependency array

  return (
    <TooltipProvider>
      <NotificationsProvider>
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white w-full">
          <NestedSidebar />
          <main className="flex-1">
            <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
          <Toaster />
        </div>
      </NotificationsProvider>
    </TooltipProvider>
  );
};

export default Layout;
