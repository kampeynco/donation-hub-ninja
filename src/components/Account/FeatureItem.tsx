
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FeatureItem as FeatureItemType } from "@/types/features";
import { BadgeCustom } from "@/components/ui/badge-custom";
import { IconStarFilled } from "@tabler/icons-react";

interface FeatureItemProps {
  feature: FeatureItemType;
  onToggleFeature: (featureId: string) => void;
  isLoading?: boolean;
}

export const FeatureItem: React.FC<FeatureItemProps> = ({ 
  feature, 
  onToggleFeature,
  isLoading = false
}) => {
  const handleToggleFeature = () => {
    if (!isLoading) {
      onToggleFeature(feature.id);
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium">{feature.name}</span>
          {feature.beta && (
            <BadgeCustom variant="beta" className="flex items-center">
              <IconStarFilled size={10} className="mr-1" />
              Beta
            </BadgeCustom>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Switch
            checked={feature.enabled}
            onCheckedChange={handleToggleFeature}
            aria-label={`Toggle ${feature.name}`}
            disabled={isLoading}
          />
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{feature.description}</p>
      
      <Separator className="my-2" />
    </div>
  );
};
