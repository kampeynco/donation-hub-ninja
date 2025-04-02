
import { supabase } from "@/integrations/supabase/client";
import { getPublicUrl } from "./storageService";

/**
 * Get the URL of the ActBlue logo from storage
 * If the image doesn't exist, a default icon will be used
 */
export const getActBlueLogo = (): string => {
  return getPublicUrl("assets", "actblue-logo.png");
};

/**
 * Checks if the ActBlue image exists in storage
 * @returns Promise resolving to boolean indicating if image exists
 */
export const checkActBlueLogoExists = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage
      .from("assets")
      .list("", {
        search: "actblue-logo.png"
      });

    if (error) {
      console.error("Error checking for ActBlue logo:", error);
      return false;
    }

    return data.some(file => file.name === "actblue-logo.png");
  } catch (error) {
    console.error("Error checking for ActBlue logo:", error);
    return false;
  }
};
