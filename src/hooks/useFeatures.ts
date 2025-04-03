
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
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
import { toast } from "sonner";

// Define the type for the realtime payload
export interface RealtimePayload {
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

export interface FeatureItem {
  id: string;
  name: FeatureName;
  description: string;
  enabled: boolean;
  status: WaitlistStatus;
  beta: boolean;
  hidden: boolean;
}

export const useFeatures = () => {
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
        .channel('waitlist-changes')
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

  return {
    features,
    loading,
    handleToggleFeature,
    handleToggleVisibility
  };
};
