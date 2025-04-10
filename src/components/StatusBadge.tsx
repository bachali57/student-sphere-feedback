
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Loader2, CheckCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'pending' | 'in_progress' | 'resolved';
  size?: 'sm' | 'md' | 'lg';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          color: 'bg-campus-pending text-white',
          icon: <Clock className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />,
          text: 'Pending'
        };
      case 'in_progress':
        return {
          color: 'bg-campus-inprogress text-white',
          icon: <Loader2 className={`${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} animate-spin`} />,
          text: 'In Progress'
        };
      case 'resolved':
        return {
          color: 'bg-campus-resolved text-white',
          icon: <CheckCircle className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />,
          text: 'Resolved'
        };
      default:
        return {
          color: 'bg-gray-500 text-white',
          icon: <Clock className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />,
          text: 'Unknown'
        };
    }
  };

  const { color, icon, text } = getStatusConfig();
  
  return (
    <Badge className={`${color} font-medium flex items-center gap-1 ${
      size === 'sm' ? 'text-xs py-0.5' : size === 'lg' ? 'text-sm py-1 px-3' : ''
    }`}>
      {icon}
      <span>{text}</span>
    </Badge>
  );
};

export default StatusBadge;
