
import { useState, useEffect } from "react";
import { useFeatureCache } from "./useFeatureCache";

export function useFeatureVisibility(featureId: string) {
  const { hasFeature, isLoading } = useFeatureCache();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setIsVisible(hasFeature(featureId));
    }
  }, [hasFeature, featureId, isLoading]);

  return { isVisible, isLoading };
}
