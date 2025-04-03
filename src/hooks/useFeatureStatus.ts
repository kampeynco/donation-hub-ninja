
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { checkWaitlistStatus, WaitlistStatus, FeatureName } from "@/services/waitlistService";
import { toast } from "sonner";
import { FeatureItem, RealtimePayload } from "@/types/features";

export const useFeatureStatus = (features: FeatureItem[]) => {
  const { user } = useAuth();
  const [updatedFeatures, setUpdatedFeatures] = useState<FeatureItem[]>(features);
  const [loading, setLoading] = useState(true);

  // Load initial status of features
  useEffect(() => {
    const loadFeatureStatuses = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Load waitlist statuses for each feature
        const featuresWithStatus = [...features];
        for (let i = 0; i < featuresWithStatus.length; i++) {
          const feature = featuresWithStatus[i];
          const status = await checkWaitlistStatus(feature.name, user.id);
          
          featuresWithStatus[i] = {
            ...feature,
            status: status?.status || null,
            enabled: status?.status === "approved"
          };
        }
        
        setUpdatedFeatures(featuresWithStatus);
      } catch (error) {
        console.error("Error loading feature statuses:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeatureStatuses();
  }, [user, features]);

  // Subscribe to waitlist status changes
  useEffect(() => {
    if (!user) return;

    // Fixed: Update Supabase channel subscription syntax
    const channel = supabase
      .channel('waitlist-changes')
      .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'waitlists',
          filter: `user_id=eq.${user.id}`
        }, 
        (payload: RealtimePayload) => {
          // Update the local state when waitlist status changes
          const updatedFeaturesState = updatedFeatures.map(feature => {
            if (feature.name.toLowerCase() === payload.new.feature_name.toLowerCase()) {
              return {
                ...feature,
                status: payload.new.status,
                enabled: payload.new.status === "approved"
              };
            }
            return feature;
          });
          setUpdatedFeatures(updatedFeaturesState);
          
          // Show toast notification for status changes
          if (payload.new.status === "approved") {
            toast.success(`${payload.new.feature_name} has been enabled for your account!`);
          } else if (payload.new.status === "rejected") {
            toast.error(`Your request for ${payload.new.feature_name} was declined.`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, updatedFeatures]);

  return { features: updatedFeatures, loading };
};
