import React, { useState } from 'react';
import { Plus, Calendar, TrendingUp, AlertCircle, LogOut } from 'lucide-react';
import Layout from './Layout';
import InvoiceForm from './InvoiceForm';
import InvoiceList from './InvoiceList';
import InvoiceView from './InvoiceView';
import DashboardStats from './DashboardStats';
import AllInvoicesView from './AllInvoicesView';
import { Invoice } from '../types';
import { useInvoices, useDashboardStats, useTodaysInvoices, useAgents } from '../hooks/useSupabaseData';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from '../utils/translations';
import { useAuth } from '../contexts/AuthContext';

interface AgentPortalProps {
  // Removed onDirectorLogin prop since it's no longer needed
}

const AgentPortal: React.FC<AgentPortalProps> = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'create' | 'view' | 'all-invoices'>('dashboard');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  
  const { language } = useSettings();
  const { t } = useTranslation(language);
  const { user, signOut } = useAuth();
  
  // Use the authenticated user's ID
  const currentAgentId = user?.id;
  
  const { invoices, loading: invoicesLoading, error: invoicesError, createInvoice, updateInvoice, deleteInvoice } = useInvoices(currentAgentId);
  const { stats, loading: statsLoading } = useDashboardStats(currentAgentId);
  const { todaysInvoices, loading: todaysLoading } = useTodaysInvoices(currentAgentId);
  const { agents, loading: agentsLoading } = useAgents();

  // Get current agent info
  const currentAgent = agents.find(agent => agent.id === currentAgentId);

  const handleSaveInvoice = async (invoiceData: any) => {
    if (!currentAgentId) {
      alert('You must be logged in to create invoices');
      return;
    }

    if (!currentAgent) {
      alert('Agent profile not found. Please contact support.');
      return;
    }

    try {
      console.log('Creating invoice for agent:', currentAgentId, currentAgent);
      
      const newInvoice = await createInvoice({
        invoice_number: invoiceData.invoiceNumber,
        agent_id: currentAgentId,
        client_data: {
          name: invoiceData.client.name,
          email: invoiceData.client.email,
          phone: invoiceData.client.phone,
          address: invoiceData.client.address
        },
        items: invoiceData.items.map((item: any) => ({
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          total: item.total
        })),
        subtotal: invoiceData.subtotal,
        tax: invoiceData.tax,
        total: invoiceData.total,
        status: invoiceData.status,
        due_date: invoiceData.dueDate,
        notes: invoiceData.notes
      });
      
      setCurrentView('dashboard');
    } catch (error) {
      console.error('Error creating invoice:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create invoice. Please try again.';
      alert(errorMessage);
    }
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setCurrentView('view');
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    // For now, just view the invoice. Edit functionality can be added later
    setCurrentView('view');
  };

  const handleDeleteInvoice = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await deleteInvoice(id);
      } catch (error) {
        console.error('Error deleting invoice:', error);
        alert('Failed to delete invoice. Please try again.');
      }
    }
  };

  const handleStatusUpdate = async (invoiceId: string, newStatus: 'draft' | 'sent' | 'paid' | 'overdue') => {
    try {
      await updateInvoice(invoiceId, { status: newStatus });
      
      // Update the selected invoice if it's the one being updated
      if (selectedInvoice && selectedInvoice.id === invoiceId) {
        setSelectedInvoice({ ...selectedInvoice, status: newStatus });
      }
      
      // Show success message
      const statusMessages = {
        draft: 'Invoice moved to draft',
        sent: 'Invoice marked as sent to client',
        paid: 'Invoice marked as paid - great job!',
        overdue: 'Invoice marked as overdue'
      };
      
      alert(statusMessages[newStatus]);
    } catch (error) {
      console.error('Error updating invoice status:', error);
      throw error; // Re-throw to be handled by InvoiceView
    }
  };

  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      await signOut();
    }
  };

  const handleViewAllInvoices = () => {
    setCurrentView('all-invoices');
  };

  // Loading state
  if (invoicesLoading || statsLoading || agentsLoading) {
    return (
      <Layout 
        title={t('agentDashboard')}
        userType="agent"
        userName={currentAgent?.name}
        onSignOut={handleSignOut}
      >
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#03989e' }}></div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (invoicesError) {
    return (
      <Layout 
        title={t('agentDashboard')}
        userType="agent"
        userName={currentAgent?.name}
        onSignOut={handleSignOut}
      >
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-900 dark:text-red-200 mb-2">Connection Error</h3>
          <p className="text-red-700 dark:text-red-300 mb-4">{invoicesError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </Layout>
    );
  }

  // Check if agent profile exists
  if (!currentAgent && !agentsLoading) {
    return (
      <Layout 
        title={t('agentDashboard')}
        userType="agent"
        onSignOut={handleSignOut}
      >
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-yellow-900 dark:text-yellow-200 mb-2">Agent Profile Not Found</h3>
          <p className="text-yellow-700 dark:text-yellow-300 mb-4">
            Your agent profile could not be found. Please contact support or try signing out and back in.
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => window.location.reload()}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
            >
              Retry
            </button>
            <button 
              onClick={handleSignOut}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
            >
              Sign Out
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (currentView === 'create') {
    return (
      <Layout 
        title={t('createInvoice')}
        userType="agent"
        userName={currentAgent?.name}
        onSignOut={handleSignOut}
      >
        <InvoiceForm
          onSave={handleSaveInvoice}
          onCancel={() => setCurrentView('dashboard')}
          currentAgent={currentAgent}
        />
      </Layout>
    );
  }

  if (currentView === 'view' && selectedInvoice) {
    return (
      <Layout 
        title="Invoice Details" 
        userType="agent"
        userName={currentAgent?.name}
        onSignOut={handleSignOut}
      >
        <InvoiceView
          invoice={selectedInvoice}
          onClose={() => setCurrentView('dashboard')}
          onEdit={() => handleEditInvoice(selectedInvoice)}
          onStatusUpdate={handleStatusUpdate}
        />
      </Layout>
    );
  }

  if (currentView === 'all-invoices') {
    return (
      <Layout 
        title="All Invoices" 
        userType="agent"
        userName={currentAgent?.name}
        onSignOut={handleSignOut}
      >
        <AllInvoicesView
          invoices={invoices}
          onView={handleViewInvoice}
          onEdit={handleEditInvoice}
          onDelete={handleDeleteInvoice}
          onBack={() => setCurrentView('dashboard')}
        />
      </Layout>
    );
  }

  return (
    <Layout 
      title={t('agentDashboard')}
      userType="agent"
      userName={currentAgent?.name}
      onSignOut={handleSignOut}
    >
      {/* Quick Actions */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('welcome')} {currentAgent?.name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{t('createAndManage')}</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentView('create')}
              className="text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200 shadow-lg hover:shadow-xl"
              style={{ backgroundColor: '#03989e' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#027a7f';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#03989e';
              }}
            >
              <Plus className="h-5 w-5" />
              <span>{t('createInvoice')}</span>
            </button>
            <button
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      <DashboardStats stats={stats} onViewAllInvoices={handleViewAllInvoices} />

      {/* Today's Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('todaysActivity')}</h3>
            <Calendar className="h-5 w-5" style={{ color: '#03989e' }} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Invoices Created:</span>
              <span className="font-medium text-gray-900 dark:text-white">{todaysInvoices.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Amount:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                ${todaysInvoices.reduce((sum, inv) => sum + inv.total, 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('performance')}</h3>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">This Month:</span>
              <span className="font-medium text-gray-900 dark:text-white">{invoices.length} invoices</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Success Rate:</span>
              <span className="font-medium text-green-600">
                {invoices.length > 0 ? Math.round((stats.paidInvoices / stats.totalInvoices) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl shadow-lg p-6 text-white" style={{ background: 'linear-gradient(135deg, #03989e 0%, #0891b2 100%)' }}>
          <h3 className="text-lg font-semibold mb-4">{t('quickTip')}</h3>
          <p className="text-sm opacity-90">
            Click on any invoice to view details and update its status when clients pay or if payments become overdue.
          </p>
        </div>
      </div>

      {/* Recent Invoices */}
      <InvoiceList
        invoices={invoices.slice(0, 10)}
        onView={handleViewInvoice}
        onEdit={handleEditInvoice}
        onDelete={handleDeleteInvoice}
        title={t('recentInvoices')}
      />

      {/* Getting Started Guide */}
      {invoices.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center mt-8">
          <div className="mb-4" style={{ color: '#03989e' }}>
            <Plus className="mx-auto h-16 w-16" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('readyToStart')}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{t('createFirstInvoice')}</p>
          <button
            onClick={() => setCurrentView('create')}
            className="text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
            style={{ backgroundColor: '#03989e' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#027a7f';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#03989e';
            }}
          >
            {t('createYourFirst')}
          </button>
        </div>
      )}
    </Layout>
  );
};

export default AgentPortal;