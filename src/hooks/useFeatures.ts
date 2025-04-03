
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { FeatureItem } from "@/types/features";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Feature {
  personas: boolean;
}

export const useFeatures = () => {
  const { user } = useAuth();
  const [features, setFeatures] = useState<FeatureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch features from database
  const fetchFeatures = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      // Get features from the database
      const { data, error } = await supabase
        .from('features')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching features:', error);
        
        // If no row found, create a new row
        if (error.code === 'PGRST116') {
          const { error: insertError } = await supabase
            .from('features')
            .insert({ user_id: user.id })
            .select();
          
          if (insertError) {
            console.error('Error creating features:', insertError);
            return;
          }
        }
        return;
      }
      
      // Convert the database feature flags to FeatureItem[]
      const featureItems: FeatureItem[] = [
        {
          id: "personas",
          name: "Personas",
          description: "Access donor personas and analytics",
          enabled: data.personas,
          beta: true,
          hidden: !data.personas // hide if not enabled
        }
      ];
      
      setFeatures(featureItems);
    } catch (err) {
      console.error('Unexpected error fetching features:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Toggle feature
  const handleToggleFeature = async (featureId: string) => {
    if (!user?.id || isProcessing) return;
    
    try {
      setIsProcessing(true);
      
      // Find the feature
      const featureIndex = features.findIndex(f => f.id === featureId);
      if (featureIndex === -1) return;
      
      const feature = features[featureIndex];
      const newEnabledState = !feature.enabled;
      
      // Update the database
      const { error } = await supabase
        .from('features')
        .update({ [featureId]: newEnabledState })
        .eq('user_id', user.id);
      
      if (error) {
        console.error(`Error updating feature ${featureId}:`, error);
        toast.error("There was an error updating the feature status.");
        return;
      }
      
      // Update the local state
      const updatedFeatures = [...features];
      updatedFeatures[featureIndex] = {
        ...feature,
        enabled: newEnabledState,
        hidden: !newEnabledState // hide if disabled
      };
      
      setFeatures(updatedFeatures);
      
      toast.success(`${feature.name} has been ${newEnabledState ? 'enabled' : 'disabled'}.`);
    } catch (error) {
      console.error(`Error toggling feature ${featureId}:`, error);
      toast.error("There was an error updating the feature status.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Set up realtime subscription
  useEffect(() => {
    if (!user?.id) return;

    let isMounted = true;

    const channel = supabase
      .channel('features-changes')
      .on(
        'postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'features',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (!isMounted) return;
          
          console.log('Realtime features update received:', payload);
          fetchFeatures();
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchFeatures]);

  // Fetch features on mount
  useEffect(() => {
    fetchFeatures();
  }, [fetchFeatures]);

  return {
    features,
    loading: loading || isProcessing,
    handleToggleFeature,
    refetchFeatures: fetchFeatures
  };
};
