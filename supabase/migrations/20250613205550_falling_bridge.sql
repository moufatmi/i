/*
  # Create demo agent account

  1. New Data
    - Insert demo agent account with credentials matching the AuthForm
    - Email: test@moussab.com
    - Name: Demo Agent
    - Department: General

  2. Security
    - Uses existing RLS policies on agents table
    - Agent can only manage their own data per existing policies

  3. Notes
    - This creates the demo account referenced in the AuthForm component
    - Password will need to be set through Supabase Auth separately
*/

-- Insert demo agent into agents table
INSERT INTO agents (
  id,
  name,
  email,
  department,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000'::uuid,
  'Demo Agent',
  'test@moussab.com',
  'General',
  now()
) ON CONFLICT (email) DO NOTHING;