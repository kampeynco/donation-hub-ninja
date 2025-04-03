
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
  const { isVisible, isLoading, refreshVisibility } = useUniverseVisibility();
  
  // Ensure we have the latest feature status when the route is loaded
  useEffect(() => {
    if (user?.id) {
      console.log(`[UniverseProtectedRoute] User ${user.id.substring(0, 8)} accessing Universe feature`);
      refreshVisibility();
    }
  }, [user?.id, refreshVisibility]);
  
  // Debug log for troubleshooting
  useEffect(() => {
    console.log("[UniverseProtectedRoute] Status:", { 
      isVisible, 
      isLoading,
      userId: user?.id ? user.id.substring(0, 8) : 'none'
    });
  }, [isVisible, isLoading, user?.id]);

  if (!user) {
    console.log(`[UniverseProtectedRoute] No user, redirecting to signin`);
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

  // Only redirect if we're sure the feature is not available (not loading and not visible)
  if (!isLoading && !isVisible) {
    console.log(`[UniverseProtectedRoute] Feature not enabled, redirecting to account`);
    toast.error(`You don't have access to the Universe feature. Enable it in your account settings.`);
    return <Navigate to="/account?tab=features" replace />;
  }

  return <>{children}</>;
};

export default UniverseProtectedRoute;
