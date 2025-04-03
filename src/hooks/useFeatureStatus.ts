
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { WaitlistStatus } from '@/services/waitlistService';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

// Define types for the data you're fetching
export interface Feature {
  id: number | string;
  name: string;
  description: string;
  waitlist_status: WaitlistStatus;
}

// Define the payload type for the real-time subscription
type WaitlistRealtimePayload = RealtimePostgresChangesPayload<{
  feature_name: string;
  status: WaitlistStatus;
  user_id: string;
  [key: string]: any;
}>;

export function useFeatureStatus(initialFeatures: Feature[]) {
  const { user } = useAuth();
  const [updatedFeatures, setUpdatedFeatures] = useState<Feature[]>(initialFeatures);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    // Fetch current waitlist statuses for this user
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

    // Set up realtime subscription using the correct channel API syntax
    const channel = supabase
      .channel('waitlist-changes')
      .on(
        'postgres_changes', 
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'waitlists',
          filter: `user_id=eq.${user.id}`
        },
        (payload: WaitlistRealtimePayload) => {
          if (!isMounted) return;
          
          console.log('Realtime waitlist update received:', payload);
          
          // Check if payload.new exists and has feature_name and status properties
          if (payload.new && 'feature_name' in payload.new && 'status' in payload.new) {
            // Update the local state when waitlist status changes
            setUpdatedFeatures(prevFeatures => 
              prevFeatures.map(feature => {
                // Match the feature name with payload data
                if (feature.name === payload.new.feature_name) {
                  return {
                    ...feature,
                    waitlist_status: payload.new.status
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
