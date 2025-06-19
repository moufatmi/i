import React from 'react';
import { DollarSign, FileText, Clock, CheckCircle } from 'lucide-react';
import { DashboardStats as Stats } from '../types';
import { formatCurrency } from '../utils/helpers';

interface DashboardStatsProps {
  stats: Stats;
  onViewAllInvoices?: () => void;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, onViewAllInvoices }) => {
  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: '#10b981',
      bgColor: '#f0fdf4',
      textColor: '#059669',
      clickable: false
    },
    {
      title: 'Total Invoices',
      value: stats.totalInvoices.toString(),
      icon: FileText,
      color: '#03989e',
      bgColor: '#f0fdfc',
      textColor: '#03989e',
      clickable: true,
      onClick: onViewAllInvoices
    },
    {
      title: 'Pending',
      value: stats.pendingInvoices.toString(),
      icon: Clock,
      color: '#f59e0b',
      bgColor: '#fffbeb',
      textColor: '#d97706',
      clickable: false
    },
    {
      title: 'Paid',
      value: stats.paidInvoices.toString(),
      icon: CheckCircle,
      color: '#10b981',
      bgColor: '#f0fdf4',
      textColor: '#059669',
      clickable: false
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => {
        const CardComponent = stat.clickable ? 'button' : 'div';
        
        return (
          <CardComponent
            key={index}
            onClick={stat.clickable ? stat.onClick : undefined}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 ${
              stat.clickable 
                ? 'hover:shadow-xl hover:scale-105 cursor-pointer transform hover:bg-blue-50 dark:hover:bg-blue-900/20' 
                : 'hover:shadow-xl'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                {stat.clickable && (
                  <p className="text-xs mt-1 font-medium" style={{ color: stat.textColor }}>Click to view all</p>
                )}
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: stat.bgColor }}>
                <stat.icon className="h-6 w-6" style={{ color: stat.textColor }} />
              </div>
            </div>
          </CardComponent>
        );
      })}
    </div>
  );
};

export default DashboardStats;