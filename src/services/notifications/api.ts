
import { supabase } from "@/integrations/supabase/client";
import type { Notification } from "@/types/notification";

/**
 * Fetch notifications with optional limit
 */
export async function fetchNotifications(limit = 50): Promise<Notification[]> {
  try {
    // Fetch notifications ordered by creation date (newest first)
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }

    return data as Notification[];
  } catch (error) {
    console.error("Exception in fetchNotifications:", error);
    return [];
  }
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
      console.error("Error marking notification as read:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Exception in markNotificationAsRead:", error);
    return false;
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .is("is_read", false);

    if (error) {
      console.error("Error marking all notifications as read:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Exception in markAllNotificationsAsRead:", error);
    return false;
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(id: string): Promise<boolean> {
  try {
    console.log(`API: Deleting notification ID: ${id}`);
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting notification:", error);
      return false;
    }

    console.log(`API: Successfully deleted notification ID: ${id}`);
    return true;
  } catch (error) {
    console.error("Exception in deleteNotification:", error);
    return false;
  }
}

/**
 * Create a new notification
 */
export async function createNewNotification(notification: Notification): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("notifications")
      .insert(notification);

    if (error) {
      console.error("Error creating notification:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Exception in createNewNotification:", error);
    return false;
  }
}
