
import React from "react";
import { useFeatureStatus } from "@/hooks/useFeatureStatus";
import FeatureItem from "./FeatureItem";
import FeaturesLoading from "./FeaturesLoading";

const FeaturesTab = () => {
  const { features, loading, error } = useFeatureStatus();
  
  if (loading) {
    return <FeaturesLoading />;
  }
  
  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Error loading features: {error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-donor-blue text-white rounded-md"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
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
          <FeatureItem key={feature.id} feature={feature} />
        ))}
      </div>
    </div>
  );
};

export default FeaturesTab;
