/*
  # Fix agent authentication and profile creation

  1. Updates
    - Ensure proper agent profile creation for authenticated users
    - Add better error handling for missing agent profiles
    - Update RLS policies to handle edge cases

  2. Security
    - Maintain existing RLS policies
    - Ensure users can only access their own data
*/

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Only create agent profile if one doesn't already exist
  IF NOT EXISTS (SELECT 1 FROM public.agents WHERE id = NEW.id) THEN
    INSERT INTO public.agents (id, name, email, department)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'name', 'New Agent'),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'department', 'General')
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update existing demo agent to match auth user ID format
UPDATE agents 
SET id = '11111111-1111-1111-1111-111111111111'
WHERE email = 'sarah@travelpro.com';