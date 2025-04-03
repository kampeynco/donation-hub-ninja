
import { useState, useEffect } from "react";
import { useFeatureCache } from "./useFeatureCache";

export function useFeatureVisibility(featureId: string) {
  const { hasFeature, isLoading, refreshCache, featureCache } = useFeatureCache();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Force a refresh when the component mounts
    refreshCache();
  }, [refreshCache]);

  useEffect(() => {
    if (!isLoading) {
      const visible = hasFeature(featureId);
      console.log(`useFeatureVisibility(${featureId}):`, { 
        visible, 
        isLoading, 
        cacheState: featureCache 
      });
      setIsVisible(visible);
    }
  }, [hasFeature, featureId, isLoading, featureCache]);

  return { isVisible, isLoading };
}
