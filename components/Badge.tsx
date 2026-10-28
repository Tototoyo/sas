import React from 'react';
// Fix: Import BedStatus type.
import type { EntityCondition, TaskStatus, BedStatus, PaymentStatus } from '../types';

interface BadgeProps {
  // Fix: Add BedStatus to the union type for the status prop.
  status: EntityCondition | TaskStatus | BedStatus | PaymentStatus;
}

const Badge: React.FC<BadgeProps> = ({ status }) => {
  const colorClasses: { [key: string]: string } = {
    // Entity Condition
    Excellent: 'bg-blue-100 text-blue-800',
    Good: 'bg-green-100 text-green-800',
    Fair: 'bg-yellow-100 text-yellow-800',
    'Needs Repair': 'bg-red-100 text-red-800',
    // Task Status
    Pending: 'bg-slate-200 text-slate-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    Completed: 'bg-green-100 text-green-800',
    // Fix: Add color classes for BedStatus.
    // Bed Status
    Ready: 'bg-green-100 text-green-800',
    'Needs Cleaning': 'bg-yellow-100 text-yellow-800',
    // Payment Status
    Paid: 'bg-green-100 text-green-800',
    'Deposit Paid': 'bg-yellow-100 text-yellow-800',
    Unpaid: 'bg-red-100 text-red-800',
  };

  const statusColor = colorClasses[status] || 'bg-slate-100 text-slate-800';

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor}`}>
      {status}
    </span>
  );
};

export default Badge;