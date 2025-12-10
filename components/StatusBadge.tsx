import React from 'react';
import { StatusCategory } from '../types';

interface StatusBadgeProps {
  status: StatusCategory;
  text?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, text }) => {
  const getStyles = (status: StatusCategory) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'submitted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'draft':
        return 'bg-stone-100 text-stone-600 border-stone-200';
      case 'not-applicable':
        return 'bg-gray-100 text-gray-500 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLabel = (status: StatusCategory) => {
    if (text) return text; // Override if specific text provided is short enough, otherwise default
    switch (status) {
      case 'approved': return 'Approved';
      case 'submitted': return 'Submitted';
      case 'pending': return 'Pending';
      case 'rejected': return 'Action Req';
      case 'draft': return 'Draft';
      case 'not-applicable': return 'N/A';
      default: return status;
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStyles(status)}`}>
      {getLabel(status)}
    </span>
  );
};

export default StatusBadge;