
-- This migration file is just for reference, we'll need to execute the SQL separately
-- Updated function to properly insert the committee_name from user metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, committee_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'committee_name', 'Default Committee'));
  RETURN NEW;
END;
$$;
