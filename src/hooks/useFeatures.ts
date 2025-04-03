
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { INITIAL_FEATURES, FeatureItem } from "@/types/features";
import { supabase } from "@/integrations/supabase/client";
import { 
  joinWaitlist, 
  resetWaitlistStatus,
  setFeatureVisibilityPreference,
  getFeatureVisibilityPreference,
  WaitlistStatus
} from "@/services/waitlistService";
import { toast } from "sonner";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

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
  const [isProcessing, setIsProcessing] = useState(false);

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

  // Toggle feature (join/leave waitlist)
  const handleToggleFeature = useCallback(async (featureId: string) => {
    if (!user || isProcessing) return;
    
    const featureIndex = features.findIndex(f => f.id === featureId);
    if (featureIndex === -1) return;
    
    const feature = features[featureIndex];
    
    try {
      setIsProcessing(true);
      
      // Show immediate feedback with optimistic UI update
      const updatedFeatures = [...features];
      
      if (feature.status === "joined" || feature.status === "approved") {
        // Optimistic UI update
        updatedFeatures[featureIndex] = {
          ...feature,
          status: null,
          enabled: false
        };
        setFeatures(updatedFeatures);
        
        // If already on waitlist or approved, remove from waitlist
        await resetWaitlistStatus(feature.name, user.id);
        toast.info(`${feature.name} has been disabled.`);
      } else {
        // Optimistic UI update
        updatedFeatures[featureIndex] = {
          ...feature,
          status: "joined",
          enabled: false
        };
        setFeatures(updatedFeatures);
        
        // Join waitlist for the feature
        await joinWaitlist(feature.name, user.id);
        toast.success(`You've been added to the waitlist for ${feature.name}.`);
      }
    } catch (error) {
      console.error(`Error updating feature ${featureId}:`, error);
      toast.error("There was an error updating the feature status.");
      
      // Revert optimistic update in case of error
      const { data } = await supabase
        .from('waitlists')
        .select('*')
        .eq('user_id', user.id)
        .eq('feature_name', feature.name)
        .single();
        
      // Restore the correct state
      const updatedFeatures = [...features];
      updatedFeatures[featureIndex] = {
        ...feature,
        status: data ? data.status : null,
        enabled: (data && data.status === "approved")
      };
      setFeatures(updatedFeatures);
    } finally {
      setIsProcessing(false);
    }
  }, [features, isProcessing, user]);

  // Toggle feature visibility in sidebar
  const handleToggleVisibility = useCallback((featureId: string) => {
    if (!user) return;
    
    const featureIndex = features.findIndex(f => f.id === featureId);
    if (featureIndex === -1) return;
    
    const feature = features[featureIndex];
    const newHiddenState = !feature.hidden;
    
    // Update UI visibility preference in localStorage
    setFeatureVisibilityPreference(feature.name, newHiddenState);
    
    // Update local state
    const updatedFeatures = [...features];
    updatedFeatures[featureIndex] = {
      ...feature,
      hidden: newHiddenState
    };
    setFeatures(updatedFeatures);
    
    toast.info(`${feature.name} is now ${newHiddenState ? 'hidden from' : 'visible in'} your sidebar.`);
  }, [features, user]);

  return {
    features,
    loading: loading || isProcessing,
    handleToggleFeature,
    handleToggleVisibility
  };
};

export type { FeatureItem };
