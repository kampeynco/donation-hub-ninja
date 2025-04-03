
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function useFeatureVisibility(featureId: string) {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkFeatureVisibility() {
      if (!user) {
        setIsVisible(false);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('features')
          .select(featureId)
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error("Error checking feature visibility:", error);
          setIsVisible(false);
        } else {
          setIsVisible(!!data[featureId]);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        setIsVisible(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkFeatureVisibility();
  }, [user, featureId]);

  return { isVisible, isLoading };
}
