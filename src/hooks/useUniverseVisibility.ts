
import { useState, useEffect } from "react";
import { useFeatureCache } from "./useFeatureCache";

export function useUniverseVisibility() {
  const { hasFeature, isLoading, refreshCache, featureCache } = useFeatureCache();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Force a refresh when the component mounts
    refreshCache();
  }, [refreshCache]);

  useEffect(() => {
    if (!isLoading) {
      const visible = hasFeature("universe");
      console.log(`useUniverseVisibility:`, { 
        visible, 
        isLoading, 
        cacheState: featureCache 
      });
      setIsVisible(visible);
    }
  }, [hasFeature, isLoading, featureCache]);

  return { isVisible, isLoading };
}
