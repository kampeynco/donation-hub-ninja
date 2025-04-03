
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FeatureItem } from "@/types/features";
import { WaitlistStatus } from "@/services/waitlistService";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

// Type interface for the waitlist table payload
interface WaitlistPayload {
  feature_name: string;
  status: WaitlistStatus;
  user_id: string;
  rejection_reason?: string | null;
  [key: string]: any;
}

export const useFeatureRealtime = (
  userId: string | undefined,
  features: FeatureItem[],
  setFeatures: React.Dispatch<React.SetStateAction<FeatureItem[]>>
) => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (!userId) return;

    let isMounted = true;

    // Set up realtime subscription
    const channel = supabase
      .channel('waitlist-changes')
      .on(
        'postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'waitlists',
          filter: `user_id=eq.${userId}`
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
      .subscribe(() => {
        if (isMounted) {
          setIsSubscribed(true);
        }
      });

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
      setIsSubscribed(false);
    };
  }, [userId, setFeatures]);

  return { isSubscribed };
};
