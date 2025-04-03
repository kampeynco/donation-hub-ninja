
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FeatureProtectedRouteProps {
  children: React.ReactNode;
  featureId: string;
}

const FeatureProtectedRoute: React.FC<FeatureProtectedRouteProps> = ({ 
  children, 
  featureId 
}) => {
  const { user, isLoaded } = useAuth();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFeatureAccess = async () => {
      if (!user) {
        setHasAccess(false);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('features')
          .select(featureId)
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          console.error('Error checking feature access:', error);
          setHasAccess(false);
        } else {
          setHasAccess(!!data[featureId]);
        }
      } catch (error) {
        console.error('Unexpected error checking feature access:', error);
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoaded) {
      checkFeatureAccess();
    }
  }, [user, isLoaded, featureId]);

  if (!isLoaded || isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/signin" replace />;
  }

  if (!hasAccess) {
    toast.error(`You don't have access to this feature. Enable it in your account settings.`);
    return <Navigate to="/account?tab=features" replace />;
  }

  return <>{children}</>;
};

export default FeatureProtectedRoute;
