
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Define types for the data you're fetching
interface Feature {
  id: number | string;
  name: string;
  description: string;
  waitlist_status: string | null;
}

interface RealtimePayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  schema: string;
  record: Database['public']['Tables']['waitlists']['Row'];
  old_record: Database['public']['Tables']['waitlists']['Row'] | null;
  errors: string[] | null;
  new: Database['public']['Tables']['waitlists']['Row'];
}

export function useFeatureStatus(initialFeatures: Feature[]) {
  const { user } = useAuth();
  const [updatedFeatures, setUpdatedFeatures] = useState<Feature[]>(initialFeatures);

  useEffect(() => {
    if (!user?.id) return;

    // Fetch current waitlist statuses for this user
    const fetchWaitlistStatus = async () => {
      const { data, error } = await supabase
        .from('waitlists')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching waitlist status:', error);
        return;
      }
      
      if (data.length > 0) {
        const updatedFeaturesState = updatedFeatures.map(feature => {
          const matchingEntry = data.find(entry => entry.feature_name === feature.name);
          if (matchingEntry) {
            return {
              ...feature,
              waitlist_status: matchingEntry.status
            };
          }
          return feature;
        });
        
        setUpdatedFeatures(updatedFeaturesState);
      }
    };

    fetchWaitlistStatus();

    // Set up realtime subscription
    const channel = supabase
      .channel('waitlist-changes')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public',
          table: 'waitlists',
          filter: `user_id=eq.${user.id}`
        },
        (payload: RealtimePayload) => {
          // Update the local state when waitlist status changes
          const updatedFeaturesState = updatedFeatures.map(feature => {
            // Match the feature name instead of non-existent feature_id
            if (feature.name === payload.new.feature_name) {
              return {
                ...feature,
                waitlist_status: payload.new.status
              };
            }
            return feature;
          });
          
          setUpdatedFeatures(updatedFeaturesState);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user?.id, initialFeatures]);

  return updatedFeatures;
}
