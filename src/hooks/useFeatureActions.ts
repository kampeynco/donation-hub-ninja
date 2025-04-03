
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  joinWaitlist, 
  resetWaitlistStatus,
  setFeatureVisibilityPreference
} from "@/services/waitlistService";
import { toast } from "sonner";
import { FeatureItem } from "@/types/features";

export const useFeatureActions = (features: FeatureItem[], setFeatures: React.Dispatch<React.SetStateAction<FeatureItem[]>>) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleToggleFeature = async (featureId: string) => {
    if (!user || isProcessing) return;
    
    const featureIndex = features.findIndex(f => f.id === featureId);
    if (featureIndex === -1) return;
    
    const feature = features[featureIndex];
    
    try {
      setIsProcessing(true);
      
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
    } finally {
      setIsProcessing(false);
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
    handleToggleFeature,
    handleToggleVisibility,
    isProcessing
  };
};
