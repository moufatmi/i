import React, { useState } from 'react';
import { X, Download, Send, Edit, User, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Invoice } from '../types';
import { formatCurrency, formatDate, getStatusColor } from '../utils/helpers';
import { generateInvoicePDF } from '../utils/pdfGenerator';

interface InvoiceViewProps {
  invoice: Invoice;
  onClose: () => void;
  onEdit: () => void;
  onStatusUpdate?: (invoiceId: string, newStatus: 'draft' | 'sent' | 'paid' | 'overdue') => void;
}

const InvoiceView: React.FC<InvoiceViewProps> = ({ invoice, onClose, onEdit, onStatusUpdate }) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleStatusUpdate = async (newStatus: 'draft' | 'sent' | 'paid' | 'overdue') => {
    if (!onStatusUpdate) return;
    
    setIsUpdatingStatus(true);
    try {
      await onStatusUpdate(invoice.id, newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update invoice status. Please try again.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      generateInvoicePDF(invoice);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const getStatusActions = () => {
    const actions = [];
    
    switch (invoice.status) {
      case 'draft':
        actions.push(
          <button
            key="send"
            onClick={() => handleStatusUpdate('sent')}
            disabled={isUpdatingStatus}
            className="text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            style={{ 
              backgroundColor: isUpdatingStatus ? '#6b7280' : '#03989e',
              opacity: isUpdatingStatus ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!isUpdatingStatus) {
                e.currentTarget.style.backgroundColor = '#027a7f';
              }
            }}
            onMouseLeave={(e) => {
              if (!isUpdatingStatus) {
                e.currentTarget.style.backgroundColor = '#03989e';
              }
            }}
          >
            <Send className="h-4 w-4" />
            <span>Send to Client</span>
          </button>
        );
        break;
        
      case 'sent':
        actions.push(
          <button
            key="mark-paid"
            onClick={() => handleStatusUpdate('paid')}
            disabled={isUpdatingStatus}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Mark as Paid</span>
          </button>
        );
        actions.push(
          <button
            key="mark-overdue"
            onClick={() => handleStatusUpdate('overdue')}
            disabled={isUpdatingStatus}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            <AlertCircle className="h-4 w-4" />
            <span>Mark Overdue</span>
          </button>
        );
        break;
        
      case 'overdue':
        actions.push(
          <button
            key="mark-paid"
            onClick={() => handleStatusUpdate('paid')}
            disabled={isUpdatingStatus}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Mark as Paid</span>
          </button>
        );
        break;
        
      case 'paid':
        // No actions needed for paid invoices
        break;
    }
    
    return actions;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Invoice Details</h2>
            <p className="text-gray-600 dark:text-gray-400">{invoice.invoiceNumber}</p>
          </div>
          <div className="flex items-center space-x-2">
            {/* Status Update Actions */}
            {onStatusUpdate && getStatusActions()}
            
            <button
              onClick={onEdit}
              className="text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
              style={{ backgroundColor: '#03989e' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#027a7f';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#03989e';
              }}
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </button>
            <button 
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            >
              <Download className="h-4 w-4" />
              <span>{isGeneratingPDF ? 'Generating...' : 'Download PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg transition-colors duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="p-8">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">INVOICE</h1>
              <div className="space-y-1">
                <p className="text-gray-600 dark:text-gray-400">Invoice Number: <span className="font-medium">{invoice.invoiceNumber}</span></p>
                <p className="text-gray-600 dark:text-gray-400">Date: <span className="font-medium">{formatDate(invoice.createdAt)}</span></p>
                <p className="text-gray-600 dark:text-gray-400">Due Date: <span className="font-medium">{formatDate(invoice.dueDate)}</span></p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white px-4 py-2 rounded-lg inline-block mb-4" style={{ backgroundColor: '#03989e' }}>
                <h2 className="text-lg font-bold">Agence de Voyage</h2>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>123 Travel Street</p>
                <p>New York, NY 10001</p>
                <p>Phone: (555) 123-4567</p>
                <p>Email: info@agencedevoyage.com</p>
              </div>
            </div>
          </div>

          {/* Client & Agent Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                <User className="h-5 w-5" style={{ color: '#03989e' }} />
                <span>Bill To:</span>
              </h3>
              <div className="border p-4 rounded-lg" style={{ backgroundColor: '#f0fdfc', borderColor: '#99f6e4' }}>
                <p className="font-bold text-gray-900 dark:text-white text-lg">{invoice.client.name}</p>
                <p className="text-gray-600 dark:text-gray-400">{invoice.client.email}</p>
                {invoice.client.phone && <p className="text-gray-600 dark:text-gray-400">{invoice.client.phone}</p>}
                {invoice.client.address && (
                  <p className="text-gray-600 dark:text-gray-400 mt-2">{invoice.client.address}</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Agent & Status:</h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="font-medium text-gray-900 dark:text-white">{invoice.agentName}</p>
                <p className="text-gray-600 dark:text-gray-400">Travel Agent</p>
                <div className="mt-3">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                </div>
                
                {/* Status Management Guide */}
                {onStatusUpdate && (
                  <div className="mt-4 p-3 border rounded-lg" style={{ backgroundColor: '#f0fdfc', borderColor: '#99f6e4' }}>
                    <h4 className="text-sm font-medium mb-2" style={{ color: '#164e63' }}>Status Management:</h4>
                    <div className="text-xs space-y-1" style={{ color: '#155e75' }}>
                      {invoice.status === 'draft' && (
                        <p>• Click "Send to Client" when ready to send this invoice</p>
                      )}
                      {invoice.status === 'sent' && (
                        <>
                          <p>• Click "Mark as Paid" when client pays</p>
                          <p>• Click "Mark Overdue" if payment is late</p>
                        </>
                      )}
                      {invoice.status === 'overdue' && (
                        <p>• Click "Mark as Paid" when client finally pays</p>
                      )}
                      {invoice.status === 'paid' && (
                        <p>✓ Invoice is fully paid - no action needed</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Client Highlight for Director */}
          <div className="mb-8 p-4 border rounded-lg" style={{ backgroundColor: '#f0fdfc', borderColor: '#99f6e4' }}>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full" style={{ backgroundColor: '#ccfbf1' }}>
                <User className="h-5 w-5" style={{ color: '#03989e' }} />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: '#164e63' }}>
                  Invoice created for client: <span className="font-bold text-lg">{invoice.client.name}</span>
                </p>
                <p className="text-xs" style={{ color: '#155e75' }}>
                  Agent {invoice.agentName} created this invoice for the above client
                </p>
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Services & Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Description</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Qty</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">Unit Price</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {invoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.description}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-center">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-right">{formatCurrency(item.unitPrice)}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white text-right">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Invoice Summary */}
          <div className="flex justify-end mb-8">
            <div className="w-full max-w-sm">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(invoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(invoice.tax)}</span>
                  </div>
                  <div className="border-t dark:border-gray-600 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">Total:</span>
                      <span className="text-lg font-bold" style={{ color: '#03989e' }}>{formatCurrency(invoice.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Notes</h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">{invoice.notes}</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 border-t dark:border-gray-700 pt-6">
            <p>Thank you for choosing Agence de Voyage!</p>
            <p>For questions about this invoice, please contact us at billing@agencedevoyage.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;