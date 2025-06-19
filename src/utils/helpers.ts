import { Invoice, InvoiceItem, DashboardStats } from '../types';

export const generateInvoiceNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `INV-${year}${month}${day}-${random}`;
};

export const calculateItemTotal = (quantity: number, unitPrice: number): number => {
  return quantity * unitPrice;
};

export const calculateSubtotal = (items: InvoiceItem[]): number => {
  return items.reduce((sum, item) => sum + item.total, 0);
};

export const calculateTax = (subtotal: number, taxRate: number = 0.1): number => {
  return subtotal * taxRate;
};

export const calculateTotal = (subtotal: number, tax: number): number => {
  return subtotal + tax;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getDashboardStats = (invoices: Invoice[]): DashboardStats => {
  const totalInvoices = invoices.length;
  const totalRevenue = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);
  const pendingInvoices = invoices.filter(inv => inv.status === 'sent').length;
  const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;

  return {
    totalInvoices,
    totalRevenue,
    pendingInvoices,
    paidInvoices
  };
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'draft':
      return 'bg-gray-100 text-gray-800';
    case 'sent':
      return 'bg-blue-100 text-blue-800';
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'overdue':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getTodaysInvoices = (invoices: Invoice[]): Invoice[] => {
  const today = new Date().toDateString();
  return invoices.filter(invoice => 
    new Date(invoice.createdAt).toDateString() === today
  );
};