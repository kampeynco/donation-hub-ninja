import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface FeatureCache {
  [featureId: string]: boolean;
}

// Global cache shared across components
let globalFeatureCache: FeatureCache = {};
let lastFetchTimestamp = 0;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes in milliseconds

// Standalone function to refresh the cache
export async function refreshFeatureCache(userId: string | undefined) {
  if (!userId) return;
  
  const currentTime = Date.now();
  
  // Skip fetching if cache is fresh
  if (Object.keys(globalFeatureCache).length > 0 && 
      currentTime - lastFetchTimestamp < CACHE_TTL) {
    return;
  }

  try {
    const { data, error } = await supabase
      .from('features')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching feature flags:', error);
    } else if (data) {
      // Extract feature flags from data
      const newCache: FeatureCache = {};
      Object.entries(data).forEach(([key, value]) => {
        // Skip non-boolean and internal properties
        if (typeof value === 'boolean' && 
            !['id', 'user_id', 'created_at', 'updated_at'].includes(key)) {
          newCache[key] = value;
        }
      });
      
      // Update global cache and timestamp
      globalFeatureCache = newCache;
      lastFetchTimestamp = currentTime;
    }
  } catch (error) {
    console.error('Unexpected error fetching features:', error);
  }
}

export function useFeatureCache() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [featureCache, setFeatureCache] = useState<FeatureCache>(globalFeatureCache);

  // Fetch and update the feature cache
  const updateFeatureCache = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    await refreshFeatureCache(user.id);
    setFeatureCache(globalFeatureCache);
    setIsLoading(false);
  }, [user]);

  // Set up realtime subscription to keep cache updated
  useEffect(() => {
    if (!user?.id) return;

    updateFeatureCache();

    const channel = supabase
      .channel('feature-cache-changes')
      .on(
        'postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'features',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          // Invalidate cache when changes occur
          lastFetchTimestamp = 0;
          updateFeatureCache();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, updateFeatureCache]);

  return {
    featureCache,
    isLoading,
    hasFeature: (featureId: string) => featureCache[featureId] || false,
    refreshCache: () => updateFeatureCache()
  };
}
