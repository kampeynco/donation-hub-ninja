
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useUniverseVisibility } from "@/hooks/useUniverseVisibility";

interface UniverseProtectedRouteProps {
  children: React.ReactNode;
}

const UniverseProtectedRoute: React.FC<UniverseProtectedRouteProps> = ({ 
  children 
}) => {
  const { user } = useAuth();
  const { isVisible, isLoading } = useUniverseVisibility();
  
  // Debug log for troubleshooting
  useEffect(() => {
    console.log("UniverseProtectedRoute:", { isVisible, isLoading });
  }, [isVisible, isLoading]);

  if (!user) {
    return <Navigate to="/auth/signin" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] p-4">
        <div className="w-full max-w-6xl">
          <Skeleton className="h-12 w-1/3 mb-6" />
          <Skeleton className="h-8 w-2/3 mb-4" />
          <Skeleton className="h-8 w-1/2 mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Skeleton className="h-48 rounded-lg" />
            <Skeleton className="h-48 rounded-lg" />
            <Skeleton className="h-48 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!isVisible) {
    toast.error(`You don't have access to the Universe feature. Enable it in your account settings.`);
    return <Navigate to="/account?tab=features" replace />;
  }

  return <>{children}</>;
};

export default UniverseProtectedRoute;
