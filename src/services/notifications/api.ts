
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUserId } from "@/services/donations/helpers";
import type { Notification } from "@/types/notification";

/**
 * Mark a notification as read
 */
export async function markNotificationRead(notificationId: string) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return false;

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error in markNotificationRead:', error);
    return false;
  }
}

/**
 * Mark all notifications as read for the current user
 */
export async function markAllNotificationsRead() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return false;

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('is_read', false);

    if (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error in markAllNotificationsRead:', error);
    return false;
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return false;

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error in deleteNotification:', error);
    return false;
  }
}

/**
 * Create a new notification
 */
export async function createNewNotification(notification: Notification) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return false;

    const { error } = await supabase
      .from('notifications')
      .insert([notification]);

    if (error) {
      console.error('Error creating notification:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error in createNewNotification:', error);
    return false;
  }
}

/**
 * Fetch notifications with optional limit
 */
export async function fetchNotifications(limit = 10): Promise<Notification[]> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return [];

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }

    return data as Notification[];
  } catch (error) {
    console.error('Error in fetchNotifications:', error);
    return [];
  }
}
