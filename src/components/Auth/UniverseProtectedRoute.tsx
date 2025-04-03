
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const { isVisible, isLoading, refreshVisibility } = useUniverseVisibility();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);
  
  // Only refresh visibility on initial mount or when user changes
  useEffect(() => {
    let isMounted = true;
    
    const checkFeatureAccess = async () => {
      if (!user?.id) return;
      
      console.log(`[UniverseProtectedRoute] User ${user.id.substring(0, 8)} accessing Universe feature at ${location.pathname}`);
      await refreshVisibility();
      
      if (isMounted) {
        setInitialCheckComplete(true);
      }
    };
    
    checkFeatureAccess();
    
    return () => { isMounted = false; };
  }, [user?.id, refreshVisibility, location.pathname]);
  
  // Only decide on redirection once loading is complete and we've done our initial check
  useEffect(() => {
    if (!isLoading && initialCheckComplete && !isVisible) {
      console.log(`[UniverseProtectedRoute] Feature not enabled, will redirect to account`);
      setShouldRedirect(true);
    }
  }, [isLoading, isVisible, initialCheckComplete]);
  
  // Debug log for troubleshooting
  useEffect(() => {
    console.log("[UniverseProtectedRoute] Status:", { 
      isVisible, 
      isLoading,
      initialCheckComplete,
      shouldRedirect,
      userId: user?.id ? user.id.substring(0, 8) : 'none',
      path: location.pathname
    });
  }, [isVisible, isLoading, user?.id, initialCheckComplete, shouldRedirect, location.pathname]);

  // Handle authentication
  if (!user) {
    console.log(`[UniverseProtectedRoute] No user, redirecting to signin`);
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  // Show loading state
  if (isLoading || !initialCheckComplete) {
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

  // Only redirect after we're completely sure the feature is not available
  if (shouldRedirect) {
    toast.error(`You don't have access to the Universe feature. Enable it in your account settings.`);
    return <Navigate to="/account?tab=features" replace />;
  }

  return <>{children}</>;
};

export default UniverseProtectedRoute;
