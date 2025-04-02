
import { Toaster } from "@/components/ui/toaster";
import DashboardSidebar from "./DashboardSidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      <DashboardSidebar />
      <main className="flex-1 transition-all duration-300">
        <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default Layout;
