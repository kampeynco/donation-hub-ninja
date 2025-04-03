
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface FeatureCache {
  [featureId: string]: boolean;
}

// Global cache shared across components
let globalFeatureCache: FeatureCache = {};
let lastFetchTimestamp = 0;
const CACHE_TTL = 30 * 1000; // 30 seconds in milliseconds (reduced from 5 minutes)

// Standalone function to refresh the cache
export async function refreshFeatureCache(userId: string | undefined): Promise<FeatureCache | null> {
  if (!userId) return null;
  
  const currentTime = Date.now();
  console.log(`[refreshFeatureCache] Checking cache for user ${userId.substring(0, 8)}...`);
  console.log(`[refreshFeatureCache] Cache age: ${(currentTime - lastFetchTimestamp) / 1000}s, TTL: ${CACHE_TTL / 1000}s`);
  
  try {
    // Always fetch fresh data from the database
    console.log(`[refreshFeatureCache] Fetching features for user ${userId.substring(0, 8)}`);
    const { data, error } = await supabase
      .from('features')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('[refreshFeatureCache] Error fetching feature flags:', error);
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
      return newCache;
    } else {
      console.warn('[refreshFeatureCache] No feature data found for user', userId.substring(0, 8));
      return null;
    }
  } catch (error) {
    console.error('[refreshFeatureCache] Unexpected error fetching features:', error);
    return null;
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

    console.log('[useFeatureCache] Updating feature cache...');
    setIsLoading(true);
    
    const newCache = await refreshFeatureCache(user.id);
    
    if (newCache) {
      setFeatureCache(newCache);
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
    hasFeature: useCallback((featureId: string) => {
      const hasAccess = featureCache[featureId] || false;
      console.log(`[useFeatureCache] Feature check for ${featureId}:`, {
        hasAccess,
        cacheState: featureCache
      });
      return hasAccess;
    }, [featureCache]),
    refreshCache: updateFeatureCache
  };
}
