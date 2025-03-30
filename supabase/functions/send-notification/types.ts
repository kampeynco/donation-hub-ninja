
// Type definitions for the notification system

export interface NotificationRequest {
  userId: string;
  donationId: string;
  amount: number;
  donorId: string;
  donorName: string | null;
  donorEmail: string | undefined;
  donationType: 'recurring' | 'one_time';
  requestId: string;
}

export interface UserProfile {
  committee_name: string;
  contact_first_name: string | null;
  contact_last_name: string | null;
  mobile_phone: string | null;
  contact_email: string | null; // Added contact_email field
}

export interface NotificationSettings {
  donations_web: boolean;
  donations_email: boolean;
  donations_text: boolean;
  recurring_web: boolean;
  recurring_email: boolean;
  recurring_text: boolean;
}
