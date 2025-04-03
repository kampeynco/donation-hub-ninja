
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useFeatureVisibility } from "@/hooks/useFeatureVisibility";

interface FeatureProtectedRouteProps {
  children: React.ReactNode;
  featureId: string;
}

const FeatureProtectedRoute: React.FC<FeatureProtectedRouteProps> = ({ 
  children, 
  featureId 
}) => {
  const { user } = useAuth();
  const { isVisible, isLoading } = useFeatureVisibility(featureId);
  
  // Debug log for troubleshooting
  useEffect(() => {
    console.log(`FeatureProtectedRoute for ${featureId}:`, { isVisible, isLoading });
  }, [featureId, isVisible, isLoading]);

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
    toast.error(`You don't have access to this feature. Enable it in your account settings.`);
    return <Navigate to="/account?tab=features" replace />;
  }

  return <>{children}</>;
};

export default FeatureProtectedRoute;
