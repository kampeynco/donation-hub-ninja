
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { INITIAL_FEATURES, FeatureItem } from "@/types/features";
import { supabase } from "@/integrations/supabase/client";
import { WaitlistStatus, getFeatureVisibilityPreference } from "@/services/waitlistService";
import { useFeatureActions } from "./useFeatureActions";
import { useFeatureRealtime } from "./useFeatureRealtime";

export const useFeatures = () => {
  const { user } = useAuth();
  const [features, setFeatures] = useState<FeatureItem[]>(INITIAL_FEATURES);
  const [loading, setLoading] = useState(true);
  
  const { handleToggleFeature, handleToggleVisibility, isProcessing } = useFeatureActions(features, setFeatures);
  
  // Use the new realtime hook
  useFeatureRealtime(user?.id, features, setFeatures);

  // Fetch waitlist statuses and apply visibility preferences
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    const fetchFeatureStatus = async () => {
      try {
        // Get waitlist statuses
        const { data: waitlistData, error } = await supabase
          .from('waitlists')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error fetching waitlist status:', error);
          return;
        }
        
        // Apply waitlist statuses and visibility preferences to features
        if (isMounted) {
          const updatedFeatures = INITIAL_FEATURES.map(feature => {
            // Find matching waitlist entry
            const waitlistEntry = waitlistData?.find(entry => entry.feature_name === feature.name);
            
            // Get visibility preference
            const hidden = getFeatureVisibilityPreference(feature.name);
            
            // Update feature with waitlist status and visibility
            return {
              ...feature,
              status: waitlistEntry?.status || null,
              enabled: waitlistEntry?.status === "approved",
              hidden
            };
          });
          
          setFeatures(updatedFeatures);
        }
      } catch (err) {
        console.error('Unexpected error fetching feature status:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFeatureStatus();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  return {
    features,
    loading: loading || isProcessing,
    handleToggleFeature,
    handleToggleVisibility
  };
};

export type { FeatureItem };
