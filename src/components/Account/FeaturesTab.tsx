
import React from "react";
import { useFeatures } from "@/hooks/useFeatures";
import { FeatureItem } from "@/components/Account/FeatureItem";
import { FeaturesLoading } from "@/components/Account/FeaturesLoading";

const FeaturesTab = () => {
  const { features, loading: isLoading, handleToggleFeature, isProcessing } = useFeatures();
  
  if (isLoading) {
    return <FeaturesLoading />;
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Available Features</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your account features and access beta programs
        </p>
      </div>
      
      <div className="space-y-4">
        {features.map((feature) => (
          <FeatureItem 
            key={feature.id} 
            feature={feature} 
            onToggleFeature={handleToggleFeature}
            isLoading={isProcessing}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturesTab;
