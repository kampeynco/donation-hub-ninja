
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

// Define feature names and their corresponding waitlist statuses
export type FeatureName = "Segments" | "Donors";
export type WaitlistStatus = "joined" | "approved" | "rejected" | "declined" | null;

// Define the waitlist entry interface
export interface WaitlistEntry {
  id: string;
  user_id: string;
  feature_name: FeatureName;
  status: WaitlistStatus;
  created_at: string;
  updated_at: string;
  rejection_reason?: string | null;
}

// Check waitlist status for a feature
export const checkWaitlistStatus = async (
  featureName: FeatureName,
  userId: string
): Promise<WaitlistEntry | null> => {
  try {
    const { data, error } = await supabase
      .from("waitlists")
      .select("*")
      .eq("user_id", userId)
      .eq("feature_name", featureName)
      .single();

    if (error) {
      if (error.code !== "PGRST116") { // Don't log "no rows returned" errors
        console.error("Error checking waitlist status:", error);
      }
      return null;
    }

    // Cast the data to our WaitlistEntry type
    return data as unknown as WaitlistEntry;
  } catch (error) {
    console.error("Unexpected error checking waitlist status:", error);
    return null;
  }
};

// Join waitlist for a feature
export const joinWaitlist = async (
  featureName: FeatureName,
  userId: string
): Promise<boolean> => {
  try {
    // Check if already on waitlist
    const existingEntry = await checkWaitlistStatus(featureName, userId);
    
    if (existingEntry) {
      // Update existing entry to "joined" status
      const { error } = await supabase
        .from("waitlists")
        .update({
          status: "joined",
          updated_at: new Date().toISOString()
        })
        .eq("id", existingEntry.id);
      
      if (error) {
        throw error;
      }
    } else {
      // Create new waitlist entry
      const { error } = await supabase
        .from("waitlists")
        .insert({
          user_id: userId,
          feature_name: featureName,
          status: "joined"
        } as any); // Use type assertion to bypass TypeScript error
      
      if (error) {
        throw error;
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error joining waitlist:", error);
    toast.error("Error joining waitlist: " + (error instanceof Error ? error.message : "An unknown error occurred"));
    return false;
  }
};

// Reset waitlist status for a feature
export const resetWaitlistStatus = async (
  featureName: FeatureName,
  userId: string
): Promise<boolean> => {
  try {
    const existingEntry = await checkWaitlistStatus(featureName, userId);
    
    if (!existingEntry) {
      return true; // Nothing to reset
    }
    
    const { error } = await supabase
      .from("waitlists")
      .delete()
      .eq("id", existingEntry.id);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error resetting waitlist status:", error);
    toast.error("Error resetting feature: " + (error instanceof Error ? error.message : "An unknown error occurred"));
    return false;
  }
};

// Decline a feature
export const declineFeature = async (
  featureName: FeatureName,
  userId: string,
  reason: string
): Promise<boolean> => {
  try {
    // Check if already on waitlist
    const existingEntry = await checkWaitlistStatus(featureName, userId);
    
    if (existingEntry) {
      // Update existing entry to "declined" status
      const { error } = await supabase
        .from("waitlists")
        .update({
          status: "declined",
          rejection_reason: reason,
          updated_at: new Date().toISOString()
        })
        .eq("id", existingEntry.id);
      
      if (error) {
        throw error;
      }
    } else {
      // Create new waitlist entry with "declined" status
      const { error } = await supabase
        .from("waitlists")
        .insert({
          user_id: userId,
          feature_name: featureName,
          status: "declined",
          rejection_reason: reason
        } as any); // Use type assertion to bypass TypeScript error
      
      if (error) {
        throw error;
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error declining feature:", error);
    return false;
  }
};

// Get and set feature visibility preferences in local storage
const VISIBILITY_PREFERENCE_KEY = "donorcamp_feature_visibility";

// Get feature visibility preference
export const getFeatureVisibilityPreference = (featureName: FeatureName): boolean => {
  try {
    const preferences = localStorage.getItem(VISIBILITY_PREFERENCE_KEY);
    if (!preferences) return false;
    
    const parsedPreferences = JSON.parse(preferences);
    return parsedPreferences[featureName] || false;
  } catch (error) {
    console.error("Error getting feature visibility preference:", error);
    return false;
  }
};

// Set feature visibility preference
export const setFeatureVisibilityPreference = (featureName: FeatureName, hidden: boolean): void => {
  try {
    const preferences = localStorage.getItem(VISIBILITY_PREFERENCE_KEY);
    const parsedPreferences = preferences ? JSON.parse(preferences) : {};
    
    parsedPreferences[featureName] = hidden;
    localStorage.setItem(VISIBILITY_PREFERENCE_KEY, JSON.stringify(parsedPreferences));
  } catch (error) {
    console.error("Error setting feature visibility preference:", error);
  }
};
