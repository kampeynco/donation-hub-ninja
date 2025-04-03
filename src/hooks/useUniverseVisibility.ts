
import { useState, useEffect } from "react";
import { useFeatureCache } from "./useFeatureCache";

export function useUniverseVisibility() {
  const { hasFeature, isLoading } = useFeatureCache();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setIsVisible(hasFeature("universe"));
    }
  }, [hasFeature, isLoading]);

  return { isVisible, isLoading };
}
