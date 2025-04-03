
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface FeatureCache {
  [featureId: string]: boolean;
}

// Global cache shared across components
let globalFeatureCache: FeatureCache = {};
let lastFetchTimestamp = 0;
let isFetchingCache = false;
const CACHE_TTL = 30 * 1000; // 30 seconds in milliseconds (reduced from 5 minutes)

// Standalone function to refresh the cache with debouncing
export async function refreshFeatureCache(userId: string | undefined): Promise<FeatureCache | null> {
  if (!userId) return null;
  
  // Don't allow concurrent refreshes
  if (isFetchingCache) {
    console.log(`[refreshFeatureCache] Refresh already in progress, skipping`);
    return globalFeatureCache;
  }
  
  const currentTime = Date.now();
  const cacheAge = currentTime - lastFetchTimestamp;
  console.log(`[refreshFeatureCache] Checking cache for user ${userId.substring(0, 8)}...`);
  console.log(`[refreshFeatureCache] Cache age: ${cacheAge / 1000}s, TTL: ${CACHE_TTL / 1000}s`);
  
  // If cache is still fresh, return it
  if (cacheAge < CACHE_TTL && Object.keys(globalFeatureCache).length > 0) {
    console.log(`[refreshFeatureCache] Using existing cache:`, globalFeatureCache);
    return globalFeatureCache;
  }
  
  try {
    isFetchingCache = true;
    
    // Fetch fresh data from the database
    console.log(`[refreshFeatureCache] Fetching features for user ${userId.substring(0, 8)}`);
    const { data, error } = await supabase
      .from('features')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('[refreshFeatureCache] Error fetching feature flags:', error);
      isFetchingCache = false;
      return null;
    } 
    
    if (data) {
      // Extract feature flags from data
      const newCache: FeatureCache = {};
      Object.entries(data).forEach(([key, value]) => {
        // Skip non-boolean and internal properties
        if (typeof value === 'boolean' && 
            !['id', 'user_id', 'created_at', 'updated_at'].includes(key)) {
          newCache[key] = value;
        }
      });
      
      console.log('[refreshFeatureCache] Updated feature cache:', newCache);
      
      // Update global cache and timestamp
      globalFeatureCache = newCache;
      lastFetchTimestamp = currentTime;
      isFetchingCache = false;
      return newCache;
    } else {
      console.warn('[refreshFeatureCache] No feature data found for user', userId.substring(0, 8));
      isFetchingCache = false;
      return null;
    }
  } catch (error) {
    console.error('[refreshFeatureCache] Unexpected error fetching features:', error);
    isFetchingCache = false;
    return null;
  }
}

export function useFeatureCache() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [featureCache, setFeatureCache] = useState<FeatureCache>(globalFeatureCache);
  const [cacheVersion, setCacheVersion] = useState(0); // To force re-renders when cache updates

  // Fetch and update the feature cache
  const updateFeatureCache = useCallback(async (force = false) => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    console.log('[useFeatureCache] Updating feature cache...');
    setIsLoading(true);
    
    // Force refresh by invalidating the timestamp if requested
    if (force) {
      lastFetchTimestamp = 0;
    }
    
    const newCache = await refreshFeatureCache(user.id);
    
    if (newCache) {
      setFeatureCache(newCache);
      setCacheVersion(prev => prev + 1); // Increment to trigger re-renders
    }
    setIsLoading(false);
  }, [user]);

  // Set up realtime subscription to keep cache updated
  useEffect(() => {
    if (!user?.id) return;

    // Force an update when the hook is first mounted
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
        (payload) => {
          // Invalidate cache when changes occur
          console.log('[useFeatureCache] Feature change detected:', payload);
          lastFetchTimestamp = 0; // Force refresh
          updateFeatureCache(true);
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
    hasFeature: useCallback((featureId: string) => {
      const hasAccess = featureCache[featureId] || false;
      console.log(`[useFeatureCache] Feature check for ${featureId}:`, {
        hasAccess,
        cacheState: featureCache,
        cacheVersion
      });
      return hasAccess;
    }, [featureCache, cacheVersion]),
    refreshCache: useCallback(() => updateFeatureCache(true), [updateFeatureCache])
  };
}
