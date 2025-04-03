
import { supabase } from "@/integrations/supabase/client";

// Check if a user is on a specific feature's waitlist and their status
export const checkWaitlistStatus = async (featureName: string, userId: string) => {
  try {
    // Use any to bypass TypeScript errors since waitlists table structure is updated
    const { data, error } = await (supabase as any)
      .from("waitlists")
      .select("status, rejection_reason")
      .eq("user_id", userId)
      .eq("feature_name", featureName)
      .single();
    
    if (error && error.code !== "PGRST116") { // PGRST116 is "no rows returned"
      console.error("Error checking waitlist status:", error);
      return null;
    }
    
    return data || null;
  } catch (error) {
    console.error("Unexpected error checking waitlist status:", error);
    return null;
  }
};

// Join a waitlist for a feature
export const joinWaitlist = async (featureName: string, userId: string) => {
  try {
    // Use any to bypass TypeScript errors since waitlists table structure is updated
    const { error } = await (supabase as any)
      .from("waitlists")
      .upsert({
        user_id: userId,
        feature_name: featureName,
        status: "joined",
        updated_at: new Date().toISOString()
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

// Decline a feature with a reason
export const declineFeature = async (featureName: string, userId: string, reason: string) => {
  try {
    // Use any to bypass TypeScript errors since waitlists table structure is updated
    const { error } = await (supabase as any)
      .from("waitlists")
      .upsert({
        user_id: userId,
        feature_name: featureName,
        status: "declined",
        rejection_reason: reason,
        updated_at: new Date().toISOString()
      }, {
        onConflict: "user_id,feature_name"
      });
    
    if (error) {
      console.error("Error declining feature:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Unexpected error declining feature:", error);
    throw error;
  }
};

// Reset waitlist status (remove from waitlist)
export const resetWaitlistStatus = async (featureName: string, userId: string) => {
  try {
    // Use any to bypass TypeScript errors since waitlists table structure is updated
    const { error } = await (supabase as any)
      .from("waitlists")
      .upsert({
        user_id: userId,
        feature_name: featureName,
        status: null,
        rejection_reason: null,
        updated_at: new Date().toISOString()
      }, {
        onConflict: "user_id,feature_name"
      });
    
    if (error) {
      console.error("Error resetting waitlist status:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Unexpected error resetting waitlist status:", error);
    throw error;
  }
};
