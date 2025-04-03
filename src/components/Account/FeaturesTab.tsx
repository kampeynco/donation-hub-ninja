
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useFeatures } from "@/hooks/useFeatures";
import { FeatureItem } from "./FeatureItem";
import { FeaturesLoading } from "./FeaturesLoading";

const FeaturesTab = () => {
  const {
    features,
    loading,
    isProcessing,
    handleToggleFeature,
    refetchFeatures
  } = useFeatures();

  // Refetch features when component mounts
  useEffect(() => {
    refetchFeatures();
  }, [refetchFeatures]);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Features</h3>
          <p className="text-sm text-muted-foreground">
            Enable or disable features for your account.
          </p>

          {loading && features.length === 0 ? (
            <FeaturesLoading />
          ) : features.length === 0 ? (
            <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-900 text-center">
              <p className="text-muted-foreground">No features are available right now.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {features.map(feature => (
                <FeatureItem 
                  key={feature.id} 
                  feature={feature} 
                  onToggleFeature={handleToggleFeature}
                  isLoading={loading || isProcessing}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturesTab;
