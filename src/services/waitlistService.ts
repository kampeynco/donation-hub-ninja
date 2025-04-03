
import { supabase } from "@/integrations/supabase/client";

// Check if a user is on a specific feature's waitlist
export const checkWaitlistStatus = async (featureName: string, userId: string) => {
  try {
    // Use any to bypass TypeScript errors since waitlists table is not in the types yet
    const { data, error } = await (supabase as any)
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
  } catch (error) {
    console.error("Unexpected error checking waitlist status:", error);
    return null;
  }
};

// Join a waitlist for a feature
export const joinWaitlist = async (featureName: string, userId: string) => {
  try {
    // Use any to bypass TypeScript errors since waitlists table is not in the types yet
    const { error } = await (supabase as any)
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
  } catch (error) {
    console.error("Unexpected error joining waitlist:", error);
    throw error;
  }
};

// Leave a waitlist for a feature
export const leaveWaitlist = async (featureName: string, userId: string) => {
  try {
    // Use any to bypass TypeScript errors since waitlists table is not in the types yet
    const { error } = await (supabase as any)
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
  } catch (error) {
    console.error("Unexpected error leaving waitlist:", error);
    throw error;
  }
};
