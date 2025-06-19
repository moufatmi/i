import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper functions for database operations
export const supabaseHelpers = {
  // Agents
  async getAgents() {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async createAgent(agent: { name: string; email: string; department: string }) {
    const { data, error } = await supabase
      .from('agents')
      .insert([agent])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getAgentById(id: string) {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Clients
  async getClients() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async createClient(client: { name: string; email: string; phone?: string; address?: string }) {
    const { data, error } = await supabase
      .from('clients')
      .insert([client])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getOrCreateClient(clientData: { name: string; email: string; phone?: string; address?: string }) {
    // First try to find existing client by email
    const { data: existingClient } = await supabase
      .from('clients')
      .select('*')
      .eq('email', clientData.email)
      .single();

    if (existingClient) {
      return existingClient;
    }

    // Create new client if not found
    return await this.createClient(clientData);
  },

  // Invoices
  async getInvoices(agentId?: string) {
    let query = supabase
      .from('invoices')
      .select(`
        *,
        agent:agents(*),
        client:clients(*),
        invoice_items(*)
      `)
      .order('created_at', { ascending: false });

    // Only filter by agent if agentId is provided (for agent view)
    // If no agentId, fetch all invoices (for director view)
    if (agentId) {
      console.log('Filtering invoices by agent ID:', agentId);
      query = query.eq('agent_id', agentId);
    } else {
      console.log('Fetching ALL invoices (Director view)');
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  },

  async createInvoice(invoiceData: {
    invoice_number: string;
    agent_id: string;
    client_id: string;
    subtotal: number;
    tax: number;
    total: number;
    status: string;
    due_date: string;
    notes?: string;
  }) {
    console.log('Creating invoice with data:', invoiceData);
    
    // Validate that agent exists
    const agent = await this.getAgentById(invoiceData.agent_id);
    if (!agent) {
      throw new Error('Agent not found. Please ensure you are properly authenticated.');
    }

    const { data, error } = await supabase
      .from('invoices')
      .insert([invoiceData])
      .select(`
        *,
        agent:agents(*),
        client:clients(*)
      `)
      .single();
    
    if (error) {
      console.error('Supabase error creating invoice:', error);
      throw new Error(`Failed to create invoice: ${error.message}`);
    }
    
    return data;
  },

  async updateInvoice(id: string, updates: Partial<{
    subtotal: number;
    tax: number;
    total: number;
    status: string;
    due_date: string;
    notes: string;
  }>) {
    const { data, error } = await supabase
      .from('invoices')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        agent:agents(*),
        client:clients(*),
        invoice_items(*)
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteInvoice(id: string) {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Invoice Items
  async createInvoiceItems(items: Array<{
    invoice_id: string;
    description: string;
    quantity: number;
    unit_price: number;
    total: number;
  }>) {
    const { data, error } = await supabase
      .from('invoice_items')
      .insert(items)
      .select();
    
    if (error) {
      console.error('Supabase error creating invoice items:', error);
      throw new Error(`Failed to create invoice items: ${error.message}`);
    }
    
    return data;
  },

  async updateInvoiceItems(invoiceId: string, items: Array<{
    id?: string;
    description: string;
    quantity: number;
    unit_price: number;
    total: number;
  }>) {
    // Delete existing items
    await supabase
      .from('invoice_items')
      .delete()
      .eq('invoice_id', invoiceId);

    // Insert new items
    const itemsToInsert = items.map(item => ({
      invoice_id: invoiceId,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total: item.total
    }));

    return await this.createInvoiceItems(itemsToInsert);
  },

  // Dashboard queries
  async getDashboardStats(agentId?: string) {
    let query = supabase
      .from('invoices')
      .select('total, status');

    // Only filter by agent if agentId is provided
    if (agentId) {
      console.log('Getting stats for agent:', agentId);
      query = query.eq('agent_id', agentId);
    } else {
      console.log('Getting stats for ALL agents (Director view)');
    }

    const { data, error } = await query;
    
    if (error) throw error;

    const invoices = data || [];
    const stats = {
      totalInvoices: invoices.length,
      totalRevenue: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + Number(inv.total), 0),
      pendingInvoices: invoices.filter(inv => inv.status === 'sent').length,
      paidInvoices: invoices.filter(inv => inv.status === 'paid').length
    };

    return stats;
  },

  async getTodaysInvoices(agentId?: string) {
    const today = new Date().toISOString().split('T')[0];
    
    let query = supabase
      .from('invoices')
      .select(`
        *,
        agent:agents(*),
        client:clients(*),
        invoice_items(*)
      `)
      .gte('created_at', `${today}T00:00:00`)
      .lt('created_at', `${today}T23:59:59`)
      .order('created_at', { ascending: false });

    // Only filter by agent if agentId is provided
    if (agentId) {
      console.log('Getting today\'s invoices for agent:', agentId);
      query = query.eq('agent_id', agentId);
    } else {
      console.log('Getting today\'s invoices for ALL agents (Director view)');
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }
};