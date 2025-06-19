import React, { useState } from 'react';
import { Plus, Trash2, Save, Send, User } from 'lucide-react';
import { Invoice, Client, InvoiceItem, Agent } from '../types';
import { generateInvoiceNumber, calculateItemTotal, calculateSubtotal, calculateTax, calculateTotal, formatCurrency } from '../utils/helpers';
import { TRAVEL_SERVICES, TAX_RATE } from '../utils/constants';

interface InvoiceFormProps {
  onSave: (invoice: any) => void;
  onCancel: () => void;
  currentAgent?: Agent;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ onSave, onCancel, currentAgent }) => {
  const [client, setClient] = useState<Client>({
    id: '',
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: '1',
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    }
  ]);

  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  });

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = calculateItemTotal(
            field === 'quantity' ? Number(value) : updatedItem.quantity,
            field === 'unitPrice' ? Number(value) : updatedItem.unitPrice
          );
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(subtotal, TAX_RATE);
  const total = calculateTotal(subtotal, tax);

  const handleSubmit = (status: 'draft' | 'sent') => {
    if (!client.name || !client.email || items.some(item => !item.description || item.quantity <= 0 || item.unitPrice <= 0)) {
      alert('Please fill in all required fields');
      return;
    }

    const invoice = {
      id: Date.now().toString(),
      invoiceNumber: generateInvoiceNumber(),
      clientId: Date.now().toString(),
      client: { ...client, id: Date.now().toString() },
      agentId: currentAgent?.id || '',
      agentName: currentAgent?.name || 'Unknown Agent',
      items,
      subtotal,
      tax,
      total,
      status,
      createdAt: new Date().toISOString(),
      dueDate: new Date(dueDate).toISOString(),
      notes
    };

    onSave(invoice);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create New Invoice</h2>
        <p className="text-gray-600 dark:text-gray-400">Fill in the details to generate an invoice for your client</p>
        {currentAgent && (
          <div className="mt-4 p-3 border rounded-lg" style={{ backgroundColor: '#f0fdfc', borderColor: '#99f6e4' }}>
            <p className="text-sm" style={{ color: '#164e63' }}>
              <span className="font-medium">Agent:</span> {currentAgent.name} ({currentAgent.department})
            </p>
          </div>
        )}
      </div>

      {/* Client Information */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 rounded-lg" style={{ backgroundColor: '#f0fdfc' }}>
            <User className="h-6 w-6" style={{ color: '#03989e' }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Client Information</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Enter the client details for this invoice</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Client Name *
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">(This will help the director identify which client this invoice is for)</span>
            </label>
            <input
              type="text"
              value={client.name}
              onChange={(e) => setClient({ ...client, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              style={{ '--tw-ring-color': '#03989e' } as React.CSSProperties}
              placeholder="Enter the client's full name (e.g., John Smith, ABC Company)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={client.email}
              onChange={(e) => setClient({ ...client, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              style={{ '--tw-ring-color': '#03989e' } as React.CSSProperties}
              placeholder="client@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={client.phone}
              onChange={(e) => setClient({ ...client, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              style={{ '--tw-ring-color': '#03989e' } as React.CSSProperties}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              style={{ '--tw-ring-color': '#03989e' } as React.CSSProperties}
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Client Address
          </label>
          <textarea
            value={client.address}
            onChange={(e) => setClient({ ...client, address: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            style={{ '--tw-ring-color': '#03989e' } as React.CSSProperties}
            placeholder="Enter client address (optional)"
          />
        </div>

        {/* Client Name Highlight */}
        {client.name && (
          <div className="mt-4 p-4 border rounded-lg" style={{ backgroundColor: '#f0fdfc', borderColor: '#99f6e4' }}>
            <div className="flex items-center space-x-2">
              <div className="p-1 rounded-full" style={{ backgroundColor: '#ccfbf1' }}>
                <User className="h-4 w-4" style={{ color: '#03989e' }} />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: '#164e63' }}>
                  Invoice for: <span className="font-bold">{client.name}</span>
                </p>
                <p className="text-xs" style={{ color: '#155e75' }}>
                  The director will see this invoice is created for "{client.name}"
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invoice Items */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Services & Items</h3>
          <button
            onClick={addItem}
            className="text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            style={{ backgroundColor: '#03989e' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#027a7f';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#03989e';
            }}
          >
            <Plus className="h-4 w-4" />
            <span>Add Item</span>
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Service/Description *
                  </label>
                  <select
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    style={{ '--tw-ring-color': '#03989e' } as React.CSSProperties}
                  >
                    <option value="">Select a service</option>
                    {TRAVEL_SERVICES.map(service => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    style={{ '--tw-ring-color': '#03989e' } as React.CSSProperties}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Unit Price *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    style={{ '--tw-ring-color': '#03989e' } as React.CSSProperties}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Total
                  </label>
                  <div className="px-4 py-3 bg-gray-100 dark:bg-gray-600 rounded-lg text-gray-900 dark:text-white font-medium">
                    {formatCurrency(item.total)}
                  </div>
                </div>
                
                <div className="md:col-span-1">
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={items.length === 1}
                    className="w-full p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="h-4 w-4 mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice Summary */}
      <div className="mb-8">
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Invoice Summary</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Tax ({(TAX_RATE * 100).toFixed(0)}%):</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(tax)}</span>
            </div>
            <div className="border-t dark:border-gray-600 pt-3">
              <div className="flex justify-between">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">Total:</span>
                <span className="text-lg font-bold" style={{ color: '#03989e' }}>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Additional Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
          style={{ '--tw-ring-color': '#03989e' } as React.CSSProperties}
          placeholder="Add any additional notes or terms..."
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <button
          onClick={onCancel}
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          Cancel
        </button>
        
        <button
          onClick={() => handleSubmit('draft')}
          className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200"
        >
          <Save className="h-4 w-4" />
          <span>Save as Draft</span>
        </button>
        
        <button
          onClick={() => handleSubmit('sent')}
          className="px-6 py-3 text-white rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200"
          style={{ backgroundColor: '#03989e' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#027a7f';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#03989e';
          }}
        >
          <Send className="h-4 w-4" />
          <span>Create & Send</span>
        </button>
      </div>
    </div>
  );
};

export default InvoiceForm;