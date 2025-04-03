
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface FeatureCache {
  [featureId: string]: boolean;
}

// Global cache shared across components
let globalFeatureCache: FeatureCache = {};
let lastFetchTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds (reduced from 10)
let isFetchingPromise: Promise<void> | null = null;

export function useFeatureCache() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    // If cache exists and is fresh, we're not loading
    return !(Object.keys(globalFeatureCache).length > 0 && 
           Date.now() - lastFetchTimestamp < CACHE_TTL);
  });
  const [featureCache, setFeatureCache] = useState<FeatureCache>(globalFeatureCache);

  // Fetch and update the feature cache
  const updateFeatureCache = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const currentTime = Date.now();
    
    // Skip fetching if cache is fresh
    if (Object.keys(globalFeatureCache).length > 0 && 
        currentTime - lastFetchTimestamp < CACHE_TTL) {
      setFeatureCache(globalFeatureCache);
      setIsLoading(false);
      return;
    }

    // Prevent multiple simultaneous fetches
    if (isFetchingPromise) {
      try {
        await isFetchingPromise;
        setFeatureCache(globalFeatureCache);
        setIsLoading(false);
      } catch (error) {
        console.error("Error waiting for feature cache:", error);
        setIsLoading(false);
      }
      return;
    }

    // Create a new fetching promise
    isFetchingPromise = (async () => {
      try {
        const { data, error } = await supabase
          .from('features')
          .select('*')
          .eq('user_id', user.id)
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
          
          // Update local state
          setFeatureCache(newCache);
        }
      } catch (error) {
        console.error('Unexpected error fetching features:', error);
      } finally {
        setIsLoading(false);
        isFetchingPromise = null;
      }
    })();

    try {
      await isFetchingPromise;
    } catch (error) {
      console.error("Error during feature fetch:", error);
    }
  }, [user]);

  // Set up realtime subscription to keep cache updated
  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    // If we already have data in the cache, set it immediately
    if (Object.keys(globalFeatureCache).length > 0) {
      setFeatureCache(globalFeatureCache);
      // Still check for fresh data, but don't block UI
      const cacheAge = Date.now() - lastFetchTimestamp;
      if (cacheAge > CACHE_TTL) {
        updateFeatureCache();
      } else {
        setIsLoading(false);
      }
    } else {
      // No cache, need to fetch
      updateFeatureCache();
    }

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
    refreshCache: updateFeatureCache
  };
}
