
export interface Notification {
  id: string;
  message: string;
  created_at: string;
  is_read: boolean;
  action: 'donor' | 'user' | 'system';
  contact_id?: string;
  date: string;
  donor_id?: string;
}
