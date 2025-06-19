/*
  # Create Demo Agent Account

  1. New Data
    - Insert demo agent account for testing
    - Agent: Sarah Johnson (sarah@travelpro.com)
    - Password: password123

  2. Security
    - Uses Supabase Auth for secure authentication
    - Links agent profile to auth user
*/

-- Insert demo agent (this will be linked to auth user when they sign up)
INSERT INTO agents (id, name, email, department) VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Sarah Johnson', 'sarah@travelpro.com', 'International')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  department = EXCLUDED.department;

-- Note: The actual auth user will be created when someone signs up with sarah@travelpro.com
-- This is just the agent profile that will be linked to that auth user