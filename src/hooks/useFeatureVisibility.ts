
import { useState, useEffect, useCallback, useRef } from "react";
import { useFeatureCache } from "./useFeatureCache";

export function useFeatureVisibility(featureId: string) {
  const { hasFeature, isLoading, refreshCache, featureCache } = useFeatureCache();
  const checkingRef = useRef(false);
  
  // Initialize with the current cache state instead of false
  const [isVisible, setIsVisible] = useState(() => {
    // Get initial state from cache if available
    if (featureCache && featureId in featureCache) {
      return featureCache[featureId] || false;
    }
    return false;
  });

  // Force an immediate check when the feature or loading state changes
  const checkVisibility = useCallback(async () => {
    // Prevent concurrent checks
    if (checkingRef.current) return;
    
    try {
      checkingRef.current = true;
      
      if (!isLoading) {
        const visible = hasFeature(featureId);
        console.log(`[useFeatureVisibility(${featureId})] Visibility check:`, { 
          visible, 
          isLoading, 
          cacheState: featureCache 
        });
        setIsVisible(visible);
      }
    } finally {
      checkingRef.current = false;
    }
  }, [hasFeature, featureId, isLoading, featureCache]);

  // Force a refresh when the component mounts
  useEffect(() => {
    console.log(`[useFeatureVisibility] Mounting for feature: ${featureId}, forcing refresh`);
    refreshCache();
  }, [refreshCache, featureId]);

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
