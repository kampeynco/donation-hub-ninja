
// Type definitions for the notification system

export interface NotificationRequest {
  userId: string;
  donationId: string;
  amount: number;
  donorId: string;
  donorName: string | null;
  donorEmail: string | undefined;
  donationType: 'recurring' | 'one_time';
  actionType: 'donation' | 'recurring_donation' | 'weekly_report' | 'marketing_update';
  requestId: string;
}

export interface UserProfile {
  committee_name: string;
  contact_first_name: string | null;
  contact_last_name: string | null;
  mobile_phone: string | null;
}

export interface NotificationSettings {
  donations_web: boolean;
  donations_email: boolean;
  donations_text: boolean;
  recurring_web: boolean;
  recurring_email: boolean;
  recurring_text: boolean;
  reports_web: boolean;
  reports_email: boolean;
  reports_text: boolean;
  marketing_web: boolean;
  marketing_email: boolean;
  marketing_text: boolean;
}
