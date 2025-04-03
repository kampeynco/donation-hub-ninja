
import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { PageLoader } from "@/components/ui/page-loader";

interface ProtectedRouteBaseProps {
  children: React.ReactNode;
  checkAccess: () => Promise<boolean>;
  redirectPath?: string;
  errorMessage?: string;
}

/**
 * Base component for all protected routes that handles loading states consistently
 */
const ProtectedRouteBase: React.FC<ProtectedRouteBaseProps> = ({
  children,
  checkAccess,
  redirectPath = "/auth/signin",
  errorMessage = "You don't have access to this feature."
}) => {
  const { user } = useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkAccessRights = async () => {
      if (!user) {
        if (isMounted) {
          setIsLoading(false);
          setHasAccess(false);
        }
        return;
      }

      try {
        // Add a minimum loading time to prevent flickering
        const startTime = Date.now();
        const accessGranted = await checkAccess();
        
        // Ensure loading state displays for at least 500ms
        const elapsedTime = Date.now() - startTime;
        const minimumDelay = Math.max(0, 500 - elapsedTime);
        
        setTimeout(() => {
          if (isMounted) {
            setHasAccess(accessGranted);
            setIsLoading(false);
          }
        }, minimumDelay);
      } catch (error) {
        console.error("Error checking access:", error);
        if (isMounted) {
          setHasAccess(false);
          setIsLoading(false);
        }
      }
    };

    checkAccessRights();

    return () => {
      isMounted = false;
    };
  }, [user, checkAccess]);

  if (!user) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  if (isLoading) {
    return <PageLoader />;
  }

  if (!hasAccess) {
    if (errorMessage) {
      toast.error(errorMessage);
    }
    return <Navigate to="/account?tab=features" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRouteBase;
