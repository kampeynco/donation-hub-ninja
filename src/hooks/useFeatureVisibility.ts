
import { useState, useEffect } from "react";
import { FeatureItem } from "@/types/features";
import { getFeatureVisibilityPreference } from "@/services/waitlistService";

export const useFeatureVisibility = (features: FeatureItem[]) => {
  const [featuresWithVisibility, setFeaturesWithVisibility] = useState<FeatureItem[]>(features);

  useEffect(() => {
    // Apply visibility preferences to features
    const featuresWithPrefs = features.map(feature => ({
      ...feature,
      hidden: getFeatureVisibilityPreference(feature.name)
    }));
    
    setFeaturesWithVisibility(featuresWithPrefs);
  }, [features]);

  return { features: featuresWithVisibility };
};
