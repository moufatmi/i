/*
  # Update demo agent credentials

  1. Updates
    - Update the demo agent email to test@moussab.com
    - Keep the same agent profile structure

  2. Notes
    - This agent profile will be linked when someone signs up with test@moussab.com
    - The password ana123 will be handled by Supabase Auth
*/

-- Update existing demo agent email
UPDATE agents 
SET email = 'test@moussab.com'
WHERE id = '11111111-1111-1111-1111-111111111111';

-- If the agent doesn't exist, create it
INSERT INTO agents (id, name, email, department) VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Moussab Test Agent', 'test@moussab.com', 'International')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  department = EXCLUDED.department;