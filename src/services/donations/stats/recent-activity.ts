
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUserId } from "../helpers";

/**
 * Helper function to fetch recent activity (notifications from the last 24 hours)
 */
export async function fetchRecentActivityCount() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return 0;
    }

    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);
    
    // Count notifications from the last 24 hours
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .gte('date', oneDayAgo.toISOString());
    
    if (error) throw error;
    
    return count || 0;
  } catch (error) {
    console.error('Error fetching recent activity count:', error);
    return 0;
  }
}
