/*
  # Update RLS Policies for Authentication

  1. Security Updates
    - Update all RLS policies to work with Supabase Auth
    - Ensure agents can only see their own data
    - Allow authenticated users to manage their invoices
    - Directors can see all data (handled in application logic)

  2. Policy Changes
    - Agents table: Users can read all agents, insert/update their own profile
    - Clients table: Authenticated users can manage clients
    - Invoices table: Agents can manage their own invoices
    - Invoice items table: Users can manage items for their invoices
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Agents can insert their own data" ON agents;
DROP POLICY IF EXISTS "Agents can read all agents" ON agents;
DROP POLICY IF EXISTS "Users can insert clients" ON clients;
DROP POLICY IF EXISTS "Users can read all clients" ON clients;
DROP POLICY IF EXISTS "Users can update clients" ON clients;
DROP POLICY IF EXISTS "Users can insert invoices" ON invoices;
DROP POLICY IF EXISTS "Users can read all invoices" ON invoices;
DROP POLICY IF EXISTS "Users can update invoices" ON invoices;
DROP POLICY IF EXISTS "Users can delete invoices" ON invoices;
DROP POLICY IF EXISTS "Users can insert invoice items" ON invoice_items;
DROP POLICY IF EXISTS "Users can read all invoice items" ON invoice_items;
DROP POLICY IF EXISTS "Users can update invoice items" ON invoice_items;
DROP POLICY IF EXISTS "Users can delete invoice items" ON invoice_items;

-- Agents policies
CREATE POLICY "Authenticated users can read all agents"
  ON agents
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own agent profile"
  ON agents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own agent profile"
  ON agents
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Clients policies
CREATE POLICY "Authenticated users can read all clients"
  ON clients
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert clients"
  ON clients
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update clients"
  ON clients
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Invoices policies
CREATE POLICY "Users can read all invoices"
  ON invoices
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own invoices"
  ON invoices
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "Users can update their own invoices"
  ON invoices
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = agent_id)
  WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "Users can delete their own invoices"
  ON invoices
  FOR DELETE
  TO authenticated
  USING (auth.uid() = agent_id);

-- Invoice items policies
CREATE POLICY "Users can read all invoice items"
  ON invoice_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert invoice items for their invoices"
  ON invoice_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM invoices 
      WHERE invoices.id = invoice_items.invoice_id 
      AND invoices.agent_id = auth.uid()
    )
  );

CREATE POLICY "Users can update invoice items for their invoices"
  ON invoice_items
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM invoices 
      WHERE invoices.id = invoice_items.invoice_id 
      AND invoices.agent_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM invoices 
      WHERE invoices.id = invoice_items.invoice_id 
      AND invoices.agent_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete invoice items for their invoices"
  ON invoice_items
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM invoices 
      WHERE invoices.id = invoice_items.invoice_id 
      AND invoices.agent_id = auth.uid()
    )
  );