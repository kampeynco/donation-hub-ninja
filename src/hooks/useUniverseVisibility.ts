
import { useState, useEffect, useCallback } from "react";
import { useFeatureCache } from "./useFeatureCache";

export function useUniverseVisibility() {
  const { hasFeature, isLoading, refreshCache, featureCache } = useFeatureCache();
  // Initialize with the current cache state instead of false
  const [isVisible, setIsVisible] = useState(() => {
    // Get initial state from cache if available
    if (featureCache && 'universe' in featureCache) {
      return featureCache['universe'] || false;
    }
    return false;
  });

  // Force an immediate check when loading state changes
  const checkVisibility = useCallback(() => {
    if (!isLoading) {
      const visible = hasFeature("universe");
      console.log(`[useUniverseVisibility] Visibility check:`, { 
        visible, 
        isLoading, 
        cacheState: featureCache 
      });
      setIsVisible(visible);
    }
  }, [hasFeature, isLoading, featureCache]);

  // Force a refresh when the component mounts
  useEffect(() => {
    console.log(`[useUniverseVisibility] Mounting, forcing refresh`);
    refreshCache();
  }, [refreshCache]);

  // Update visibility whenever dependencies change
  useEffect(() => {
    checkVisibility();
  }, [checkVisibility]);

  return { 
    isVisible, 
    isLoading,
    refreshVisibility: refreshCache
  };
}
