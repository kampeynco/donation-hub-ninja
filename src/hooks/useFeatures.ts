
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { FeatureItem, INITIAL_FEATURES } from "@/types/features";
import { useFeatureStatus } from "./useFeatureStatus";
import { useFeatureVisibility } from "./useFeatureVisibility";
import { useFeatureActions } from "./useFeatureActions";

export type { FeatureItem } from "@/types/features";

export const useFeatures = () => {
  const { user } = useAuth();
  const [features, setFeatures] = useState<FeatureItem[]>(INITIAL_FEATURES);
  
  // Get feature statuses from waitlist - convert INITIAL_FEATURES to the expected format
  const featuresForStatus = INITIAL_FEATURES.map(feature => ({
    id: feature.id,
    name: feature.name,
    description: feature.description,
    waitlist_status: feature.status
  }));
  
  const updatedFeaturesWithStatus = useFeatureStatus(featuresForStatus);
  
  // Apply feature statuses to our features
  useEffect(() => {
    if (updatedFeaturesWithStatus.length > 0) {
      const updatedFeatures = features.map(feature => {
        const statusFeature = updatedFeaturesWithStatus.find(f => f.name === feature.name);
        if (statusFeature) {
          return {
            ...feature,
            status: statusFeature.waitlist_status
          };
        }
        return feature;
      });
      
      setFeatures(updatedFeatures);
    }
  }, [updatedFeaturesWithStatus]);
  
  // Apply visibility preferences
  const { features: featuresWithVisibility } = useFeatureVisibility(features);
  
  // Get feature action handlers
  const { handleToggleFeature, handleToggleVisibility, isProcessing } = useFeatureActions(
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
    loading: isProcessing,
    handleToggleFeature,
    handleToggleVisibility
  };
};
