
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { PageLoader } from "@/components/ui/page-loader";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  // Add a minimum loading time to ensure consistency
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [loading]);

  if (loading || isLoading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
