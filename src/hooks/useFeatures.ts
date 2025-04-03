
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { INITIAL_FEATURES, FeatureItem } from "@/types/features";
import { supabase } from "@/integrations/supabase/client";
import { WaitlistStatus, getFeatureVisibilityPreference } from "@/services/waitlistService";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { useFeatureActions } from "./useFeatureActions";

// Type interface for the waitlist table payload
interface WaitlistPayload {
  feature_name: string;
  status: WaitlistStatus;
  user_id: string;
  rejection_reason?: string | null;
  [key: string]: any;
}

export const useFeatures = () => {
  const { user } = useAuth();
  const [features, setFeatures] = useState<FeatureItem[]>(INITIAL_FEATURES);
  const [loading, setLoading] = useState(true);
  
  const { handleToggleFeature, handleToggleVisibility, isProcessing } = useFeatureActions(features, setFeatures);

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

    // Set up realtime subscription
    const channel = supabase
      .channel('waitlist-changes')
      .on(
        'postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'waitlists',
          filter: `user_id=eq.${user.id}`
        },
        (payload: RealtimePostgresChangesPayload<WaitlistPayload>) => {
          if (!isMounted) return;
          
          console.log('Realtime waitlist update received:', payload);
          
          // Check if payload.new exists and has necessary properties
          const newData = payload.new as { feature_name?: string; status?: WaitlistStatus } | null;
          
          if (newData && typeof newData.feature_name === 'string' && newData.status !== undefined) {
            setFeatures(prevFeatures => 
              prevFeatures.map(feature => {
                if (feature.name === newData.feature_name) {
                  return {
                    ...feature,
                    status: newData.status,
                    enabled: newData.status === "approved"
                  };
                }
                return feature;
              })
            );
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
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
