
-- Enable REPLICA IDENTITY FULL for the notifications table
ALTER TABLE public.notifications REPLICA IDENTITY FULL;

-- Add the notifications table to the supabase_realtime publication
BEGIN;
  -- Check if the table is already in the publication
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
    AND schemaname = 'public'
    AND tablename = 'notifications'
  ) THEN
    -- Add the table to the publication
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  END IF;
COMMIT;
