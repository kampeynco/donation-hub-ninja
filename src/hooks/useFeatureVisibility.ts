
import { useState, useEffect } from "react";
import { useFeatureCache } from "./useFeatureCache";

export function useFeatureVisibility(featureId: string) {
  const { hasFeature, isLoading } = useFeatureCache();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    // Only update state if component is still mounted
    if (!isLoading && isMounted) {
      setIsVisible(hasFeature(featureId));
    }
    
    return () => { isMounted = false; };
  }, [hasFeature, featureId, isLoading]);

  return { isVisible, isLoading };
}
