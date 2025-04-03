
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NotificationsProvider } from "@/context/NotificationsContext";
import DashboardSidebar from "./DashboardSidebar";
import { useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
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
