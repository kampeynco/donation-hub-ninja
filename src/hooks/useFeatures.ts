
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { FeatureItem, INITIAL_FEATURES } from "@/types/features";

// Simple placeholder functions since we're not using these now
const useFeatureStatus = (features: FeatureItem[]) => {
  return { features, loading: false };
};

const useFeatureVisibility = (features: FeatureItem[]) => {
  return { features };
};

const useFeatureActions = (features: FeatureItem[], setFeatures: any) => {
  return {
    handleToggleFeature: () => {},
    handleToggleVisibility: () => {}
  };
};

export type { FeatureItem } from "@/types/features";

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
