
import { useState, useEffect, useCallback, useRef } from "react";
import { useFeatureCache } from "./useFeatureCache";

export function useUniverseVisibility() {
  const { hasFeature, isLoading, refreshCache, featureCache } = useFeatureCache();
  const checkingRef = useRef(false);
  const lastCheckTimeRef = useRef(0);
  
  // Initialize with the current cache state instead of false
  const [isVisible, setIsVisible] = useState(() => {
    // Get initial state from cache if available
    if (featureCache && 'universe' in featureCache) {
      return featureCache['universe'] || false;
    }
    return false;
  });

  // Force an immediate check when loading state changes
  const checkVisibility = useCallback(async () => {
    // Prevent concurrent checks
    if (checkingRef.current) {
      console.log(`[useUniverseVisibility] Check already in progress, skipping`);
      return;
    }
    
    // Throttle checks
    const now = Date.now();
    if (now - lastCheckTimeRef.current < 500) {
      console.log(`[useUniverseVisibility] Throttling check, last check was ${now - lastCheckTimeRef.current}ms ago`);
      return;
    }
    
    try {
      checkingRef.current = true;
      lastCheckTimeRef.current = now;
      
      if (!isLoading) {
        const visible = hasFeature("universe");
        console.log(`[useUniverseVisibility] Visibility check:`, { 
          visible, 
          isLoading
        });
        
        setIsVisible(visible);
      } else {
        console.log(`[useUniverseVisibility] Skipping check while loading`);
      }
    } catch (error) {
      console.error(`[useUniverseVisibility] Error checking visibility:`, error);
    } finally {
      checkingRef.current = false;
    }
  }, [hasFeature, isLoading]);

  // Force a refresh when the component mounts
  useEffect(() => {
    console.log(`[useUniverseVisibility] Mounting, forcing refresh`);
    refreshCache();
  }, [refreshCache]);

  // Update visibility whenever dependencies change
  useEffect(() => {
    checkVisibility();
  }, [checkVisibility]);

  // Update visibility when cache changes
  useEffect(() => {
    if (featureCache && 'universe' in featureCache) {
      const newVisibility = featureCache['universe'] || false;
      console.log(`[useUniverseVisibility] Cache updated, new visibility:`, newVisibility);
      setIsVisible(newVisibility);
    }
  }, [featureCache]);

  return { 
    isVisible, 
    isLoading,
    refreshVisibility: refreshCache
  };
}
