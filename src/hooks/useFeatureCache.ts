import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface FeatureCache {
  [featureId: string]: boolean;
}

// Global cache shared across components
let globalFeatureCache: FeatureCache = {};
let lastFetchTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
let isFetchingPromise: Promise<void> | null = null;

// Helper function to check if cache is fresh - defined outside the hook
const isCacheFresh = () => {
  return Object.keys(globalFeatureCache).length > 0 && 
         Date.now() - lastFetchTimestamp < CACHE_TTL;
};

export function useFeatureCache() {
  const { user } = useAuth();
  
  // Initialize with cache freshness check using the function defined above
  const [isLoading, setIsLoading] = useState(!isCacheFresh());
  const [featureCache, setFeatureCache] = useState<FeatureCache>(globalFeatureCache);

  // Process feature data from database response
  const processFeatureData = useCallback((data: any): FeatureCache => {
    const newCache: FeatureCache = {};
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        // Skip non-boolean and internal properties
        if (typeof value === 'boolean' && 
            !['id', 'user_id', 'created_at', 'updated_at'].includes(key)) {
          newCache[key] = value;
        }
      });
    }
    return newCache;
  }, []);

  // Fetch and update the feature cache
  const updateFeatureCache = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    // Skip fetching if cache is fresh
    if (isCacheFresh()) {
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
        } else {
          // Update global cache and timestamp
          globalFeatureCache = processFeatureData(data);
          lastFetchTimestamp = Date.now();
          
          // Update local state
          setFeatureCache(globalFeatureCache);
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
  }, [user, processFeatureData]);

  // Set up realtime subscription to keep cache updated
  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    // Handle initial cache state
    if (isCacheFresh()) {
      setFeatureCache(globalFeatureCache);
      setIsLoading(false);
    } else {
      updateFeatureCache();
    }

    // Set up realtime subscription
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
    hasFeature: useCallback((featureId: string) => featureCache[featureId] || false, [featureCache]),
    refreshCache: updateFeatureCache
  };
}
