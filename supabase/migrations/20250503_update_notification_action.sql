
-- Update the notification_action type to include recurring_donation
ALTER TYPE notification_action ADD VALUE IF NOT EXISTS 'recurring_donation';
