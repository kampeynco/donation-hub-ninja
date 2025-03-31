
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "@/components/Notifications/NotificationBell";
import { toast } from "@/hooks/use-toast";

/**
 * Creates a new notification in the database
 */
export async function createNotification({
  message,
  action,
  donorId = null
}: {
  message: string;
  action: 'user' | 'system' | 'donor';
  donorId?: string | null;
}): Promise<Notification | null> {
  try {
    const notificationData = {
      message,
      action,
      donor_id: donorId,
      date: new Date().toISOString(),
      is_read: false
    };
    
    const { data, error } = await supabase
      .from('notifications')
      .insert(notificationData)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating notification:', error);
      return null;
    }
    
    return data as Notification;
  } catch (error) {
    console.error('Error in createNotification:', error);
    return null;
  }
}

/**
 * Marks a notification as read
 */
export async function markNotificationAsRead(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);
      
    if (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in markNotificationAsRead:', error);
    return false;
  }
}

/**
 * Marks all unread notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<boolean> {
  try {
    const { data: unreadNotifications, error: fetchError } = await supabase
      .from('notifications')
      .select('id')
      .eq('is_read', false);
      
    if (fetchError) {
      console.error('Error fetching unread notifications:', fetchError);
      return false;
    }
    
    if (!unreadNotifications || unreadNotifications.length === 0) {
      return true; // No unread notifications to update
    }
    
    const unreadIds = unreadNotifications.map(n => n.id);
    
    const { error: updateError } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .in('id', unreadIds);
      
    if (updateError) {
      console.error('Error marking all notifications as read:', updateError);
      return false;
    }
    
    toast({
      title: 'Success',
      description: 'All notifications marked as read',
    });
    
    return true;
  } catch (error) {
    console.error('Error in markAllNotificationsAsRead:', error);
    return false;
  }
}

/**
 * Deletes a notification
 */
export async function deleteNotification(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting notification:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete notification',
        variant: 'destructive'
      });
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteNotification:', error);
    return false;
  }
}

/**
 * Fetches recent notifications
 */
export async function fetchRecentNotifications(limit = 10): Promise<Notification[]> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('date', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
    
    return data as Notification[];
  } catch (error) {
    console.error('Error in fetchRecentNotifications:', error);
    return [];
  }
}
