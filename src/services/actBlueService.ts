
import { supabase } from "@/integrations/supabase/client";

/**
 * Get the URL of the ActBlue logo from storage
 * If the image doesn't exist, a default icon will be used
 */
export const getActBlueLogo = (): string => {
  return "https://igjnhwvtasegwyiwcdkr.supabase.co/storage/v1/object/public/assets/images/updated_actblue_icon.png";
};

/**
 * Checks if the ActBlue image exists in storage
 * @returns Promise resolving to boolean indicating if image exists
 */
export const checkActBlueLogoExists = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage
      .from("assets")
      .list("images", {
        search: "updated_actblue_icon.png"
      });

    if (error) {
      console.error("Error checking for ActBlue logo:", error);
      return false;
    }

    return data.some(file => file.name === "updated_actblue_icon.png");
  } catch (error) {
    console.error("Error checking for ActBlue logo:", error);
    return false;
  }
};
