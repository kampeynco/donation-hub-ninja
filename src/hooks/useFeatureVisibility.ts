
import { useState, useEffect, useCallback, useRef } from "react";
import { useFeatureCache } from "./useFeatureCache";

export function useFeatureVisibility(featureId: string) {
  const { hasFeature, isLoading, refreshCache, featureCache } = useFeatureCache();
  const checkingRef = useRef(false);
  const lastCheckTimeRef = useRef(0);
  
  // Initialize with the current cache state instead of false
  const [isVisible, setIsVisible] = useState(() => {
    // Get initial state from cache if available
    if (featureCache && featureId in featureCache) {
      return featureCache[featureId] || false;
    }
    return false;
  });

  // Force an immediate check when the feature or loading state changes, with debounce
  const checkVisibility = useCallback(async () => {
    // Prevent concurrent checks
    if (checkingRef.current) {
      console.log(`[useFeatureVisibility(${featureId})] Check already in progress, skipping`);
      return;
    }
    
    // Throttle checks
    const now = Date.now();
    if (now - lastCheckTimeRef.current < 500) {
      console.log(`[useFeatureVisibility(${featureId})] Throttling check, last check was ${now - lastCheckTimeRef.current}ms ago`);
      return;
    }
    
    try {
      checkingRef.current = true;
      lastCheckTimeRef.current = now;
      
      if (!isLoading) {
        const visible = hasFeature(featureId);
        console.log(`[useFeatureVisibility(${featureId})] Visibility check:`, { 
          visible, 
          isLoading
        });
        
        setIsVisible(visible);
      } else {
        console.log(`[useFeatureVisibility(${featureId})] Skipping check while loading`);
      }
    } catch (error) {
      console.error(`[useFeatureVisibility(${featureId})] Error checking visibility:`, error);
    } finally {
      checkingRef.current = false;
    }
  }, [hasFeature, featureId, isLoading]);

  // Force a refresh when the component mounts
  useEffect(() => {
    console.log(`[useFeatureVisibility] Mounting for feature: ${featureId}, forcing refresh`);
    refreshCache();
  }, [refreshCache, featureId]);

  // Update visibility whenever dependencies change
  useEffect(() => {
    checkVisibility();
  }, [checkVisibility]);

  // Update visibility when cache changes
  useEffect(() => {
    if (featureCache && featureId in featureCache) {
      const newVisibility = featureCache[featureId] || false;
      console.log(`[useFeatureVisibility(${featureId})] Cache updated, new visibility:`, newVisibility);
      setIsVisible(newVisibility);
    }
  }, [featureCache, featureId]);

  return { 
    isVisible, 
    isLoading,
    refreshVisibility: refreshCache
  };
}
