
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FeatureStatusBadge } from "./FeatureStatusBadge";
import { FeatureItem as FeatureItemType } from "@/hooks/useFeatures";

interface FeatureItemProps {
  feature: FeatureItemType;
  onToggleFeature: (featureId: string) => void;
  onToggleVisibility: (featureId: string) => void;
}

export const FeatureItem: React.FC<FeatureItemProps> = ({ 
  feature, 
  onToggleFeature, 
  onToggleVisibility 
}) => {
  const isEnabled = feature.status === "approved" || feature.status === "joined";
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium">{feature.name}</span>
        <div className="flex items-center gap-3">
          <FeatureStatusBadge status={feature.status} beta={feature.beta} />
          <Switch
            checked={isEnabled}
            onCheckedChange={() => onToggleFeature(feature.id)}
            disabled={feature.status === "rejected"}
          />
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{feature.description}</p>
      
      {/* Only show UI visibility toggle if feature is enabled or declined */}
      {(feature.status === "approved" || feature.status === "declined") && (
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
          <div>
            <Label className="font-medium">Show in sidebar</Label>
            <p className="text-xs text-muted-foreground">Control visibility in your navigation menu</p>
          </div>
          <Switch
            checked={!feature.hidden}
            onCheckedChange={() => onToggleVisibility(feature.id)}
          />
        </div>
      )}
      
      <Separator className="my-2" />
    </div>
  );
};
