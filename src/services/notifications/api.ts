
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUserId } from "@/services/donations/helpers";
import { Notification } from "@/types/notification";

/**
 * Fetches notifications for the current user with optional filtering
 */
export async function fetchNotifications(
  type?: "all" | "donor" | "user" | "system",
  page = 1,
  limit = 50
): Promise<Notification[]> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return [];

    const startIndex = (page - 1) * limit;
    
    let query = supabase
      .from("notifications")
      .select("*")
      .order("date", { ascending: false })
      .range(startIndex, startIndex + limit - 1);

    // Apply type filter if provided
    if (type && type !== "all") {
      query = query.eq("action", type);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }

    // Convert to Notification type
    return data as Notification[];
  } catch (error) {
    console.error("Error in fetchNotifications:", error);
    return [];
  }
}

/**
 * Fetches unread notification count for the current user
 */
export async function fetchUnreadCount(): Promise<number> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return 0;

    const { count, error } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false);

    if (error) {
      console.error("Error fetching unread count:", error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error("Error in fetchUnreadCount:", error);
    return 0;
  }
}

/**
 * Marks a notification as read or unread
 */
export async function markNotificationReadStatus(
  notificationId: string,
  isRead = true
): Promise<boolean> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return false;

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: isRead })
      .eq("id", notificationId);

    if (error) {
      console.error("Error marking notification:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in markNotificationReadStatus:", error);
    return false;
  }
}

/**
 * Marks all notifications as read
 */
export async function markAllNotificationsRead(): Promise<boolean> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return false;

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("is_read", false);

    if (error) {
      console.error("Error marking all notifications as read:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in markAllNotificationsRead:", error);
    return false;
  }
}

/**
 * Deletes a notification
 */
export async function deleteNotification(
  notificationId: string
): Promise<boolean> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return false;

    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId);

    if (error) {
      console.error("Error deleting notification:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteNotification:", error);
    return false;
  }
}

/**
 * Fetches notifications by type for the current user (counts only)
 */
export async function fetchNotificationCountsByType(): Promise<{
  all: number;
  donor: number;
  user: number;
  system: number;
}> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { all: 0, donor: 0, user: 0, system: 0 };

    // Get all notifications count
    const { count: allCount, error: allError } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true });

    if (allError) {
      console.error("Error fetching all notifications count:", allError);
      return { all: 0, donor: 0, user: 0, system: 0 };
    }

    // Get donor notifications count
    const { count: donorCount, error: donorError } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("action", "donor");

    if (donorError) {
      console.error("Error fetching donor notifications count:", donorError);
      return { all: allCount || 0, donor: 0, user: 0, system: 0 };
    }

    // Get user notifications count
    const { count: userCount, error: userError } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("action", "user");

    if (userError) {
      console.error("Error fetching user notifications count:", userError);
      return { all: allCount || 0, donor: donorCount || 0, user: 0, system: 0 };
    }

    // Get system notifications count
    const { count: systemCount, error: systemError } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("action", "system");

    if (systemError) {
      console.error("Error fetching system notifications count:", systemError);
      return {
        all: allCount || 0,
        donor: donorCount || 0,
        user: userCount || 0,
        system: 0,
      };
    }

    return {
      all: allCount || 0,
      donor: donorCount || 0,
      user: userCount || 0,
      system: systemCount || 0,
    };
  } catch (error) {
    console.error("Error in fetchNotificationCountsByType:", error);
    return { all: 0, donor: 0, user: 0, system: 0 };
  }
}
