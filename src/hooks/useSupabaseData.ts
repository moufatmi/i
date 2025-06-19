import { useState, useEffect } from 'react';
import { supabaseHelpers } from '../lib/supabase';
import { Invoice, Agent, Client, DashboardStats } from '../types';

// Transform database data to match our types
const transformInvoiceData = (dbInvoice: any): Invoice => {
  return {
    id: dbInvoice.id,
    invoiceNumber: dbInvoice.invoice_number,
    clientId: dbInvoice.client_id,
    client: {
      id: dbInvoice.client?.id || dbInvoice.client_id,
      name: dbInvoice.client?.name || 'Unknown Client',
      email: dbInvoice.client?.email || '',
      phone: dbInvoice.client?.phone || '',
      address: dbInvoice.client?.address || ''
    },
    agentId: dbInvoice.agent_id,
    agentName: dbInvoice.agent?.name || 'Unknown Agent',
    items: (dbInvoice.invoice_items || []).map((item: any) => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      unitPrice: Number(item.unit_price),
      total: Number(item.total)
    })),
    subtotal: Number(dbInvoice.subtotal),
    tax: Number(dbInvoice.tax),
    total: Number(dbInvoice.total),
    status: dbInvoice.status as 'draft' | 'sent' | 'paid' | 'overdue',
    createdAt: dbInvoice.created_at,
    dueDate: dbInvoice.due_date,
    notes: dbInvoice.notes || ''
  };
};

export const useInvoices = (agentId?: string) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching invoices for agent:', agentId || 'ALL AGENTS (Director view)');
      
      const data = await supabaseHelpers.getInvoices(agentId);
      console.log('Raw invoice data:', data);
      
      const transformedData = data.map(transformInvoiceData);
      console.log('Transformed invoice data:', transformedData);
      
      setInvoices(transformedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch invoices';
      setError(errorMessage);
      console.error('Error fetching invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [agentId]);

  const createInvoice = async (invoiceData: {
    invoice_number: string;
    agent_id: string;
    client_data: { name: string; email: string; phone?: string; address?: string };
    items: Array<{ description: string; quantity: number; unit_price: number; total: number }>;
    subtotal: number;
    tax: number;
    total: number;
    status: string;
    due_date: string;
    notes?: string;
  }) => {
    try {
      console.log('Creating invoice with data:', invoiceData);
      
      if (!invoiceData.agent_id) {
        throw new Error('Agent ID is required to create an invoice');
      }
      
      // Create or get client
      const client = await supabaseHelpers.getOrCreateClient(invoiceData.client_data);
      console.log('Client created/found:', client);
      
      // Create invoice
      const invoice = await supabaseHelpers.createInvoice({
        invoice_number: invoiceData.invoice_number,
        agent_id: invoiceData.agent_id,
        client_id: client.id,
        subtotal: invoiceData.subtotal,
        tax: invoiceData.tax,
        total: invoiceData.total,
        status: invoiceData.status,
        due_date: invoiceData.due_date,
        notes: invoiceData.notes
      });
      console.log('Invoice created:', invoice);

      // Create invoice items
      const itemsWithInvoiceId = invoiceData.items.map(item => ({
        ...item,
        invoice_id: invoice.id
      }));
      
      await supabaseHelpers.createInvoiceItems(itemsWithInvoiceId);
      console.log('Invoice items created');
      
      // Refresh invoices list
      await fetchInvoices();
      
      return invoice;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create invoice';
      setError(errorMessage);
      console.error('Error creating invoice:', err);
      throw err;
    }
  };

  const updateInvoice = async (id: string, updates: Partial<Invoice>) => {
    try {
      console.log('Updating invoice:', id, updates);
      
      const dbUpdates: any = {};
      
      if (updates.subtotal !== undefined) dbUpdates.subtotal = updates.subtotal;
      if (updates.tax !== undefined) dbUpdates.tax = updates.tax;
      if (updates.total !== undefined) dbUpdates.total = updates.total;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

      await supabaseHelpers.updateInvoice(id, dbUpdates);
      
      // Update items if provided
      if (updates.items) {
        await supabaseHelpers.updateInvoiceItems(id, updates.items);
      }
      
      await fetchInvoices();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update invoice';
      setError(errorMessage);
      console.error('Error updating invoice:', err);
      throw err;
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      console.log('Deleting invoice:', id);
      await supabaseHelpers.deleteInvoice(id);
      await fetchInvoices();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete invoice';
      setError(errorMessage);
      console.error('Error deleting invoice:', err);
      throw err;
    }
  };

  return {
    invoices,
    loading,
    error,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    refetch: fetchInvoices
  };
};

export const useAgents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching agents...');
        
        const data = await supabaseHelpers.getAgents();
        console.log('Raw agents data:', data);
        
        const transformedData: Agent[] = data.map(agent => ({
          id: agent.id,
          name: agent.name,
          email: agent.email,
          department: agent.department
        }));
        console.log('Transformed agents data:', transformedData);
        
        setAgents(transformedData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch agents';
        setError(errorMessage);
        console.error('Error fetching agents:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  return { agents, loading, error };
};

export const useDashboardStats = (agentId?: string) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalInvoices: 0,
    totalRevenue: 0,
    pendingInvoices: 0,
    paidInvoices: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching dashboard stats for:', agentId || 'ALL AGENTS (Director view)');
        
        const data = await supabaseHelpers.getDashboardStats(agentId);
        console.log('Dashboard stats:', data);
        
        setStats(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard stats';
        setError(errorMessage);
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [agentId]);

  return { stats, loading, error };
};

export const useTodaysInvoices = (agentId?: string) => {
  const [todaysInvoices, setTodaysInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodaysInvoices = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching today\'s invoices for:', agentId || 'ALL AGENTS (Director view)');
        
        const data = await supabaseHelpers.getTodaysInvoices(agentId);
        console.log('Today\'s invoices data:', data);
        
        const transformedData = data.map(transformInvoiceData);
        setTodaysInvoices(transformedData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch today\'s invoices';
        setError(errorMessage);
        console.error('Error fetching today\'s invoices:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodaysInvoices();
  }, [agentId]);

  return { todaysInvoices, loading, error };
};