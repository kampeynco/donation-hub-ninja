
import { useState, useEffect, useCallback } from "react";
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
  
  // Use the realtime hook
  useFeatureRealtime(user?.id, features, setFeatures);

  // Memoize the fetch function to avoid recreating it on every render
  const fetchFeatureStatus = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
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
    } catch (err) {
      console.error('Unexpected error fetching feature status:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Fetch waitlist statuses and apply visibility preferences on mount and when user changes
  useEffect(() => {
    fetchFeatureStatus();
  }, [fetchFeatureStatus]);

  return {
    features,
    loading: loading || isProcessing,
    handleToggleFeature,
    handleToggleVisibility,
    refetchFeatures: fetchFeatureStatus
  };
};

export type { FeatureItem };
