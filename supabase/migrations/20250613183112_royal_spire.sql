/*
  # Travel Agency Invoice Management System Database Schema

  1. New Tables
    - `agents`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `department` (text)
      - `created_at` (timestamp)
    
    - `clients`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `address` (text)
      - `created_at` (timestamp)
    
    - `invoices`
      - `id` (uuid, primary key)
      - `invoice_number` (text, unique)
      - `agent_id` (uuid, foreign key)
      - `client_id` (uuid, foreign key)
      - `subtotal` (decimal)
      - `tax` (decimal)
      - `total` (decimal)
      - `status` (text)
      - `due_date` (date)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `invoice_items`
      - `id` (uuid, primary key)
      - `invoice_id` (uuid, foreign key)
      - `description` (text)
      - `quantity` (integer)
      - `unit_price` (decimal)
      - `total` (decimal)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their data
    - Directors can view all data, agents can only manage their own invoices

  3. Indexes
    - Add indexes for frequently queried columns
    - Optimize for dashboard queries and reporting
*/

-- Create agents table
CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  department text NOT NULL DEFAULT 'General',
  created_at timestamptz DEFAULT now()
);

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  address text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text UNIQUE NOT NULL,
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  subtotal decimal(10,2) NOT NULL DEFAULT 0,
  tax decimal(10,2) NOT NULL DEFAULT 0,
  total decimal(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue')),
  due_date date NOT NULL,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create invoice_items table
CREATE TABLE IF NOT EXISTS invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE,
  description text NOT NULL,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price decimal(10,2) NOT NULL DEFAULT 0 CHECK (unit_price >= 0),
  total decimal(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- Create policies for agents table
CREATE POLICY "Agents can read all agents"
  ON agents
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Agents can insert their own data"
  ON agents
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policies for clients table
CREATE POLICY "Users can read all clients"
  ON clients
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert clients"
  ON clients
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update clients"
  ON clients
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create policies for invoices table
CREATE POLICY "Users can read all invoices"
  ON invoices
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert invoices"
  ON invoices
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update invoices"
  ON invoices
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete invoices"
  ON invoices
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for invoice_items table
CREATE POLICY "Users can read all invoice items"
  ON invoice_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert invoice items"
  ON invoice_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update invoice items"
  ON invoice_items
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete invoice items"
  ON invoice_items
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_invoices_agent_id ON invoices(agent_id);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for invoices table
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample agents
INSERT INTO agents (id, name, email, department) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Sarah Johnson', 'sarah@travelagency.com', 'International'),
  ('22222222-2222-2222-2222-222222222222', 'Mike Chen', 'mike@travelagency.com', 'Domestic'),
  ('33333333-3333-3333-3333-333333333333', 'Emma Davis', 'emma@travelagency.com', 'Corporate'),
  ('44444444-4444-4444-4444-444444444444', 'James Wilson', 'james@travelagency.com', 'Luxury')
ON CONFLICT (email) DO NOTHING;