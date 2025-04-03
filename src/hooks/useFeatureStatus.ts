import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { Database } from '@/types/supabase';

// Define types for the data you're fetching
interface Feature {
  id: number;
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
    let channelSubscription: (() => void) | null = null;

    if (user?.id) {
      channelSubscription = initChannelSubscription();
    }

    return () => {
      if (channelSubscription) {
        channelSubscription();
      }
    };
  }, [user?.id, updatedFeatures]);

  // Initialize the subscription to the channel
  const initChannelSubscription = () => {
    if (!user?.id) return;

    // Fixed: Correcting Supabase channel subscription syntax
    const channel = supabase
      .channel('waitlist-changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public',
          table: 'waitlists',
          filter: `user_id=eq.${user.id}`
        },
        (payload: RealtimePayload) => {
          // Update the local state when waitlist status changes
          const updatedFeaturesState = updatedFeatures.map(feature => {
            if (feature.id === payload.new.feature_id) {
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
  };

  return updatedFeatures;
}
