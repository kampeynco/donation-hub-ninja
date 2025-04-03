
import { supabase } from "@/integrations/supabase/client";

// Check if a user is on a specific feature's waitlist
export const checkWaitlistStatus = async (featureName: string, userId: string) => {
  const { data, error } = await supabase
    .from("waitlists")
    .select("joined")
    .eq("user_id", userId)
    .eq("feature_name", featureName)
    .single();
  
  if (error && error.code !== "PGRST116") { // PGRST116 is "no rows returned"
    console.error("Error checking waitlist status:", error);
    return null;
  }
  
  return data?.joined ?? null;
};

// Join a waitlist for a feature
export const joinWaitlist = async (featureName: string, userId: string) => {
  const { error } = await supabase
    .from("waitlists")
    .upsert({
      user_id: userId,
      feature_name: featureName,
      joined: true
    }, {
      onConflict: "user_id,feature_name"
    });
  
  if (error) {
    console.error("Error joining waitlist:", error);
    throw error;
  }
  
  return true;
};

// Leave a waitlist for a feature
export const leaveWaitlist = async (featureName: string, userId: string) => {
  const { error } = await supabase
    .from("waitlists")
    .upsert({
      user_id: userId,
      feature_name: featureName,
      joined: false
    }, {
      onConflict: "user_id,feature_name"
    });
  
  if (error) {
    console.error("Error leaving waitlist:", error);
    throw error;
  }
  
  return true;
};
