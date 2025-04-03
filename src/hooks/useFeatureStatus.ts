
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { WaitlistStatus } from '@/services/waitlistService';

// Define types for the data you're fetching
export interface Feature {
  id: number | string;
  name: string;
  description: string;
  waitlist_status: WaitlistStatus;
}

export function useFeatureStatus(initialFeatures: Feature[]) {
  const { user } = useAuth();
  const [updatedFeatures, setUpdatedFeatures] = useState<Feature[]>(initialFeatures);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current waitlist statuses
  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    const fetchWaitlistStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('waitlists')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error fetching waitlist status:', error);
          return;
        }
        
        if (data.length > 0 && isMounted) {
          const updatedFeaturesState = initialFeatures.map(feature => {
            const matchingEntry = data.find(entry => entry.feature_name === feature.name);
            if (matchingEntry) {
              return {
                ...feature,
                waitlist_status: matchingEntry.status as WaitlistStatus
              };
            }
            return feature;
          });
          
          setUpdatedFeatures(updatedFeaturesState);
        }
      } catch (err) {
        console.error('Unexpected error fetching waitlist status:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchWaitlistStatus();

    return () => {
      isMounted = false;
    };
  }, [user?.id, initialFeatures]);

  // Set up realtime subscription
  useEffect(() => {
    if (!user?.id) return;

    let isMounted = true;

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
        (payload) => {
          if (!isMounted) return;
          
          console.log('Realtime waitlist update received:', payload);
          
          // Check if payload.new exists and has feature_name and status properties
          const newData = payload.new as { feature_name?: string; status?: WaitlistStatus } | null;
          
          if (newData && typeof newData.feature_name === 'string' && newData.status !== undefined) {
            // Update the local state when waitlist status changes
            setUpdatedFeatures(prevFeatures => 
              prevFeatures.map(feature => {
                // Match the feature name with payload data
                if (feature.name === newData.feature_name) {
                  return {
                    ...feature,
                    waitlist_status: newData.status
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
  }, [user?.id, initialFeatures]);

  return { features: updatedFeatures, isLoading };
}
