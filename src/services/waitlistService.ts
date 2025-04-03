
import { supabase } from "@/integrations/supabase/client";

// Define a type for valid feature names based on the database schema
export type FeatureName = "Personas";

// Define the waitlist status type to match our database enum
export type WaitlistStatus = "joined" | "approved" | "rejected" | "declined" | null;

// Check if a user is on a specific feature's waitlist and their status
export const checkWaitlistStatus = async (featureName: FeatureName, userId: string) => {
  try {
    const { data, error } = await supabase
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
export const joinWaitlist = async (featureName: FeatureName, userId: string) => {
  try {
    const { error } = await supabase
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
export const declineFeature = async (featureName: FeatureName, userId: string, reason: string) => {
  try {
    const { error } = await supabase
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
export const resetWaitlistStatus = async (featureName: FeatureName, userId: string) => {
  try {
    const { error } = await supabase
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

// Get the visibility preference for a feature from localStorage
export const getFeatureVisibilityPreference = (featureName: FeatureName): boolean => {
  const key = `hide${featureName}Sidebar`;
  return localStorage.getItem(key) === "true";
};

// Set the visibility preference for a feature in localStorage
export const setFeatureVisibilityPreference = (featureName: FeatureName, hidden: boolean): void => {
  const key = `hide${featureName}Sidebar`;
  localStorage.setItem(key, hidden.toString());
};
