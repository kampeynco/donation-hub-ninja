
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  joinWaitlist, 
  resetWaitlistStatus,
  setFeatureVisibilityPreference
} from "@/services/waitlistService";
import { toast } from "sonner";
import { FeatureItem } from "@/types/features";
import { supabase } from "@/integrations/supabase/client";

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
      
      // Show immediate feedback with optimistic UI update
      const updatedFeatures = [...features];
      
      if (feature.status === "joined" || feature.status === "approved") {
        // Optimistic UI update
        updatedFeatures[featureIndex] = {
          ...feature,
          status: null,
          enabled: false
        };
        setFeatures(updatedFeatures);
        
        // If already on waitlist or approved, remove from waitlist
        await resetWaitlistStatus(feature.name, user.id);
        toast.info(`${feature.name} has been disabled.`);
      } else {
        // Optimistic UI update
        updatedFeatures[featureIndex] = {
          ...feature,
          status: "joined",
          enabled: false
        };
        setFeatures(updatedFeatures);
        
        // Join waitlist for the feature
        await joinWaitlist(feature.name, user.id);
        toast.success(`You've been added to the waitlist for ${feature.name}.`);
      }
      
      // Ensure that after the database update, we actually fetch the new state
      const { data } = await supabase
        .from('waitlists')
        .select('*')
        .eq('user_id', user.id)
        .eq('feature_name', feature.name)
        .maybeSingle();
        
      // Apply the actual database state to ensure it matches
      if (data) {
        const realUpdatedFeatures = [...features];
        realUpdatedFeatures[featureIndex] = {
          ...feature,
          status: data.status,
          enabled: data.status === "approved"
        };
        setFeatures(realUpdatedFeatures);
      }
    } catch (error) {
      console.error(`Error updating feature ${featureId}:`, error);
      toast.error("There was an error updating the feature status.");
      
      // Revert optimistic update in case of error
      const { data } = await supabase
        .from('waitlists')
        .select('*')
        .eq('user_id', user.id)
        .eq('feature_name', feature.name)
        .maybeSingle();
        
      // Restore the correct state
      const updatedFeatures = [...features];
      updatedFeatures[featureIndex] = {
        ...feature,
        status: data ? data.status : null,
        enabled: (data && data.status === "approved")
      };
      setFeatures(updatedFeatures);
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
