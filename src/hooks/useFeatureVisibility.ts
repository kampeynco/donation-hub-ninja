
import { useState, useEffect } from "react";
import { useFeatureCache } from "./useFeatureCache";

export function useFeatureVisibility(featureId: string) {
  const { hasFeature, isLoading, featureCache } = useFeatureCache();
  // Initialize with current known state instead of always false
  const [isVisible, setIsVisible] = useState(() => {
    return Object.keys(featureCache).length > 0 ? hasFeature(featureId) : false;
  });

  useEffect(() => {
    if (!isLoading) {
      setIsVisible(hasFeature(featureId));
    }
  }, [hasFeature, featureId, isLoading, featureCache]);

  return { isVisible, isLoading };
}
