
import { useState, useEffect } from "react";
import { useFeatureCache } from "./useFeatureCache";

export function useUniverseVisibility() {
  const { hasFeature, isLoading } = useFeatureCache();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    // Only update state if component is still mounted
    if (!isLoading && isMounted) {
      setIsVisible(hasFeature("universe"));
    }
    
    return () => { isMounted = false; };
  }, [hasFeature, isLoading]);

  return { isVisible, isLoading };
}
