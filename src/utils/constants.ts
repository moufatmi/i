export const INVOICE_STATUSES = {
  DRAFT: 'draft',
  SENT: 'sent',
  PAID: 'paid',
  OVERDUE: 'overdue'
} as const;

export const TAX_RATE = 0.1; // 10% tax rate

export const TRAVEL_SERVICES = [
  'Flight Booking',
  'Hotel Reservation',
  'Car Rental',
  'Travel Insurance',
  'Visa Processing',
  'Tour Package',
  'Airport Transfer',
  'Travel Consultation',
  'Group Booking',
  'Cruise Booking'
];

export const MOCK_AGENTS: Agent[] = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah@travelagency.com', department: 'International' },
  { id: '2', name: 'Mike Chen', email: 'mike@travelagency.com', department: 'Domestic' },
  { id: '3', name: 'Emma Davis', email: 'emma@travelagency.com', department: 'Corporate' },
  { id: '4', name: 'James Wilson', email: 'james@travelagency.com', department: 'Luxury' }
];