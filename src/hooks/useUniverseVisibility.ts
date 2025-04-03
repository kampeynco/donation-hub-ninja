
import { useState, useEffect } from "react";
import { useFeatureCache } from "./useFeatureCache";

export function useUniverseVisibility() {
  const { hasFeature, isLoading, featureCache } = useFeatureCache();
  // Initialize with current known state instead of always false
  const [isVisible, setIsVisible] = useState(() => {
    return Object.keys(featureCache).length > 0 ? hasFeature("universe") : false;
  });

  useEffect(() => {
    if (!isLoading) {
      setIsVisible(hasFeature("universe"));
    }
  }, [hasFeature, isLoading, featureCache]);

  return { isVisible, isLoading };
}
