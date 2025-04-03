
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { IconStarFilled } from "@tabler/icons-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  checkWaitlistStatus, 
  joinWaitlist, 
  resetWaitlistStatus,
  getFeatureVisibilityPreference,
  setFeatureVisibilityPreference,
  WaitlistStatus,
  FeatureName
} from "@/services/waitlistService";

interface FeatureItem {
  id: string;
  name: FeatureName;
  description: string;
  enabled: boolean;
  status: WaitlistStatus;
  beta: boolean;
  hidden: boolean;
}

// Define the type for the realtime payload
interface RealtimePayload {
  schema: string;
  table: string;
  commit_timestamp: string;
  eventType: string;
  new: {
    feature_name: string;
    status: WaitlistStatus;
    [key: string]: any;
  };
  old: {
    [key: string]: any;
  };
  errors: any;
}

const FeaturesTab = () => {
  const { user } = useAuth();
  const [features, setFeatures] = useState<FeatureItem[]>([
    {
      id: "personas",
      name: "Personas",
      description: "Access donor personas and analytics",
      enabled: false,
      status: null,
      beta: true,
      hidden: false
    }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatureStatuses = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Load waitlist statuses for each feature
        const updatedFeatures = [...features];
        for (let i = 0; i < updatedFeatures.length; i++) {
          const feature = updatedFeatures[i];
          const status = await checkWaitlistStatus(feature.name, user.id);
          const isHidden = getFeatureVisibilityPreference(feature.name);
          
          updatedFeatures[i] = {
            ...feature,
            status: status?.status || null,
            enabled: status?.status === "approved",
            hidden: isHidden
          };
        }
        
        setFeatures(updatedFeatures);
      } catch (error) {
        console.error("Error loading feature statuses:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeatureStatuses();

    // Set up realtime subscription for waitlist changes
    if (user) {
      const channel = supabase
        .channel('public:waitlists')
        .on('postgres_changes', 
          {
            event: '*',
            schema: 'public',
            table: 'waitlists',
            filter: `user_id=eq.${user.id}`
          }, 
          (payload: RealtimePayload) => {
            // Update the local state when waitlist status changes
            const updatedFeatures = features.map(feature => {
              if (feature.name.toLowerCase() === payload.new.feature_name.toLowerCase()) {
                return {
                  ...feature,
                  status: payload.new.status,
                  enabled: payload.new.status === "approved"
                };
              }
              return feature;
            });
            setFeatures(updatedFeatures);
            
            // Show toast notification for status changes
            if (payload.new.status === "approved") {
              toast.success(`${payload.new.feature_name} has been enabled for your account!`);
            } else if (payload.new.status === "rejected") {
              toast.error(`Your request for ${payload.new.feature_name} was declined.`);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const handleToggleFeature = async (featureId: string) => {
    if (!user) return;
    
    const featureIndex = features.findIndex(f => f.id === featureId);
    if (featureIndex === -1) return;
    
    const feature = features[featureIndex];
    
    try {
      if (feature.status === "joined" || feature.status === "approved") {
        // If already on waitlist or approved, remove from waitlist
        await resetWaitlistStatus(feature.name, user.id);
        
        // Update local state
        const updatedFeatures = [...features];
        updatedFeatures[featureIndex] = {
          ...feature,
          status: null,
          enabled: false
        };
        setFeatures(updatedFeatures);
        
        toast.info(`${feature.name} has been disabled.`);
      } else {
        // Join waitlist for the feature
        await joinWaitlist(feature.name, user.id);
        
        // Update local state
        const updatedFeatures = [...features];
        updatedFeatures[featureIndex] = {
          ...feature,
          status: "joined",
          enabled: false
        };
        setFeatures(updatedFeatures);
        
        toast.success(`You've been added to the waitlist for ${feature.name}.`);
      }
    } catch (error) {
      console.error(`Error updating feature ${featureId}:`, error);
      toast.error("There was an error updating the feature status.");
    }
  };

  const handleToggleVisibility = (featureId: string) => {
    if (!user) return;
    
    const featureIndex = features.findIndex(f => f.id === featureId);
    if (featureIndex === -1) return;
    
    const feature = features[featureIndex];
    const newHiddenState = !feature.hidden;
    
    // Update UI visibility preference in localStorage
    setFeatureVisibilityPreference(feature.name, newHiddenState);
    
    // Update local state
    const updatedFeatures = [...features];
    updatedFeatures[featureIndex] = {
      ...feature,
      hidden: newHiddenState
    };
    setFeatures(updatedFeatures);
    
    toast.info(`${feature.name} is now ${newHiddenState ? 'hidden from' : 'visible in'} your sidebar.`);
  };

  const getStatusText = (feature: FeatureItem) => {
    if (feature.status === "approved") return "Enabled";
    if (feature.status === "joined") return "On waitlist";
    if (feature.status === "rejected") return "Not eligible";
    if (feature.status === "declined") return "Declined";
    return "Disabled";
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Available Features</h3>
          <p className="text-sm text-muted-foreground">
            Manage which features are enabled for your account.
          </p>

          {loading ? (
            <div className="py-4">
              <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {features.map(feature => (
                <div key={feature.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{feature.name}</span>
                      {feature.beta && (
                        <span className="bg-donor-blue bg-opacity-10 text-donor-blue text-xs px-2 py-0.5 rounded-full flex items-center">
                          <IconStarFilled size={10} className="mr-1" />
                          Beta
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        {getStatusText(feature)}
                      </span>
                      <Switch
                        checked={feature.status === "joined" || feature.status === "approved"}
                        onCheckedChange={() => handleToggleFeature(feature.id)}
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
                        onCheckedChange={() => handleToggleVisibility(feature.id)}
                      />
                    </div>
                  )}
                  
                  <Separator className="my-2" />
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturesTab;
