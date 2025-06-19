export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  client: Client;
  agentId: string;
  agentName: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  createdAt: string;
  dueDate: string;
  notes?: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  department: string;
}

export interface DashboardStats {
  totalInvoices: number;
  totalRevenue: number;
  pendingInvoices: number;
  paidInvoices: number;
}

export interface User {
  username: string;
  password: string;
  role: 'agent' | 'director';
  name: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}