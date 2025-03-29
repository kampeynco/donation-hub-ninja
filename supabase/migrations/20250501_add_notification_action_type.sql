
-- Create an enum type for notification actions
DO $$ BEGIN
    CREATE TYPE notification_action AS ENUM (
        'donation',
        'recurring_donation',
        'weekly_report',
        'marketing_update'
    );
EXCEPTION
    WHEN duplicate_object THEN
        NULL; -- Type already exists, do nothing
END $$;

-- Modify notifications table if needed
-- Check if the 'action' column exists in the notifications table
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'notifications' 
        AND column_name = 'action'
    ) THEN
        -- Add action column if it doesn't exist
        ALTER TABLE public.notifications 
        ADD COLUMN action notification_action NOT NULL;
    END IF;
END $$;

-- Ensure we have the RLS policy for notifications
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_policies 
        WHERE tablename = 'notifications'
    ) THEN
        -- Enable row level security
        ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
        
        -- Create policy to allow users to see their own notifications
        CREATE POLICY "Users can view their own notifications" 
        ON public.notifications
        FOR SELECT
        USING (true);  -- All authenticated users can view notifications
    END IF;
END $$;

-- Add updated_at trigger if needed
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_trigger 
        WHERE tgname = 'handle_notifications_updated_at'
    ) THEN
        -- Create the updated_at trigger
        CREATE TRIGGER handle_notifications_updated_at
        BEFORE UPDATE ON public.notifications
        FOR EACH ROW
        EXECUTE FUNCTION handle_updated_at();
    END IF;
END $$;
