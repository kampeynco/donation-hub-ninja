
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function useUniverseVisibility() {
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
          .select('universe')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error || !data) {
          console.error("Error checking Universe feature visibility:", error);
          setIsVisible(false);
        } else {
          setIsVisible(!!data.universe);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        setIsVisible(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkFeatureVisibility();
  }, [user]);

  return { isVisible, isLoading };
}
