
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { FeatureItem, INITIAL_FEATURES } from "@/types/features";
import { useFeatureStatus } from "./useFeatureStatus";
import { useFeatureVisibility } from "./useFeatureVisibility";
import { useFeatureActions } from "./useFeatureActions";

export { FeatureItem } from "@/types/features";

export const useFeatures = () => {
  const { user } = useAuth();
  const [features, setFeatures] = useState<FeatureItem[]>(INITIAL_FEATURES);
  
  // Get feature statuses from waitlist
  const { features: featuresWithStatus, loading } = useFeatureStatus(features);
  
  // Apply visibility preferences
  const { features: featuresWithVisibility } = useFeatureVisibility(featuresWithStatus);
  
  // Get feature action handlers
  const { handleToggleFeature, handleToggleVisibility } = useFeatureActions(
    featuresWithVisibility, 
    setFeatures
  );
  
  // Update combined state
  useEffect(() => {
    if (featuresWithVisibility.length > 0) {
      setFeatures(featuresWithVisibility);
    }
  }, [featuresWithVisibility]);

  return {
    features,
    loading,
    handleToggleFeature,
    handleToggleVisibility
  };
};
