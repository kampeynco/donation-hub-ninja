
import { useState, useEffect, useCallback } from "react";
import { useFeatureCache } from "./useFeatureCache";

export function useFeatureVisibility(featureId: string) {
  const { hasFeature, isLoading, refreshCache, featureCache } = useFeatureCache();
  const [isVisible, setIsVisible] = useState(false);

  // Force an immediate check when the feature or loading state changes
  const checkVisibility = useCallback(() => {
    if (!isLoading) {
      const visible = hasFeature(featureId);
      console.log(`[useFeatureVisibility(${featureId})] Visibility check:`, { 
        visible, 
        isLoading, 
        cacheState: featureCache 
      });
      setIsVisible(visible);
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
