
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FeatureStatusBadge } from "./FeatureStatusBadge";
import { FeatureItem as FeatureItemType } from "@/types/features";

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
  const isRejected = feature.status === "rejected";
  
  const handleToggleFeature = () => {
    onToggleFeature(feature.id);
  };
  
  const handleToggleVisibility = () => {
    onToggleVisibility(feature.id);
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium">{feature.name}</span>
        <div className="flex items-center gap-3">
          <FeatureStatusBadge status={feature.status} beta={feature.beta} />
          <Switch
            checked={isEnabled}
            onCheckedChange={handleToggleFeature}
            disabled={isRejected}
            aria-label={`Toggle ${feature.name}`}
          />
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{feature.description}</p>
      
      {/* Only show UI visibility toggle if feature is enabled or has been declined */}
      {(feature.status === "approved" || feature.status === "declined") && (
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
          <div>
            <Label htmlFor={`visibility-${feature.id}`} className="font-medium">Show in sidebar</Label>
            <p className="text-xs text-muted-foreground">Control visibility in your navigation menu</p>
          </div>
          <Switch
            id={`visibility-${feature.id}`}
            checked={!feature.hidden}
            onCheckedChange={handleToggleVisibility}
            aria-label={`Toggle visibility of ${feature.name} in sidebar`}
          />
        </div>
      )}
      
      <Separator className="my-2" />
    </div>
  );
};
