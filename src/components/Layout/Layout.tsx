
import { Toaster } from "@/components/ui/toaster";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <div className="container py-6">{children}</div>
      </main>
      <Toaster />
    </div>
  );
};

export default Layout;
