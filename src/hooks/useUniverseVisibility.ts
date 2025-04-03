
import { useState, useEffect, useCallback } from "react";
import { useFeatureCache } from "./useFeatureCache";

export function useUniverseVisibility() {
  const { hasFeature, isLoading, refreshCache, featureCache } = useFeatureCache();
  const [isVisible, setIsVisible] = useState(false);

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
