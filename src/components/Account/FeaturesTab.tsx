
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useFeatures } from "@/hooks/useFeatures";
import { FeatureItem } from "./FeatureItem";
import { FeaturesLoading } from "./FeaturesLoading";

const FeaturesTab = () => {
  const { features, loading, handleToggleFeature, handleToggleVisibility } = useFeatures();

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Available Features</h3>
          <p className="text-sm text-muted-foreground">
            Manage which features are enabled for your account.
          </p>

          {loading ? (
            <FeaturesLoading />
          ) : (
            <div className="space-y-4">
              {features.map(feature => (
                <FeatureItem 
                  key={feature.id}
                  feature={feature}
                  onToggleFeature={handleToggleFeature}
                  onToggleVisibility={handleToggleVisibility}
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
