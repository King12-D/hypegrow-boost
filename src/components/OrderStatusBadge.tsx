
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Package, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: string;
  paymentStatus?: string;
}

const OrderStatusBadge = ({ status, paymentStatus }: OrderStatusBadgeProps) => {
  const getStatusConfig = () => {
    if (paymentStatus === 'pending') {
      return {
        variant: 'secondary' as const,
        icon: <Clock className="w-3 h-3" />,
        text: 'Awaiting Payment',
        className: 'bg-yellow-100 text-yellow-800'
      };
    }

    switch (status) {
      case 'pending':
        return {
          variant: 'secondary' as const,
          icon: <Clock className="w-3 h-3" />,
          text: 'Pending',
          className: 'bg-yellow-100 text-yellow-800'
        };
      case 'processing':
        return {
          variant: 'default' as const,
          icon: <Package className="w-3 h-3" />,
          text: 'Processing',
          className: 'bg-blue-100 text-blue-800'
        };
      case 'completed':
        return {
          variant: 'default' as const,
          icon: <CheckCircle className="w-3 h-3" />,
          text: 'Completed',
          className: 'bg-green-100 text-green-800'
        };
      case 'cancelled':
        return {
          variant: 'destructive' as const,
          icon: <XCircle className="w-3 h-3" />,
          text: 'Cancelled',
          className: 'bg-red-100 text-red-800'
        };
      case 'refunded':
        return {
          variant: 'secondary' as const,
          icon: <AlertCircle className="w-3 h-3" />,
          text: 'Refunded',
          className: 'bg-gray-100 text-gray-800'
        };
      default:
        return {
          variant: 'secondary' as const,
          icon: <Clock className="w-3 h-3" />,
          text: status,
          className: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.icon}
      <span className="ml-1">{config.text}</span>
    </Badge>
  );
};

export default OrderStatusBadge;
