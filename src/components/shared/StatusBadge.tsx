'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
    status: string;
    className?: string;
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    // Order statuses
    pending: { label: 'Pending', variant: 'secondary' },
    shipped: { label: 'Shipped', variant: 'default' },
    delivered: { label: 'Delivered', variant: 'default' },
    returned: { label: 'Returned', variant: 'destructive' },
    refund: { label: 'Refund', variant: 'destructive' },
    refunded: { label: 'Refunded', variant: 'destructive' },

    // Product statuses
    active: { label: 'Active', variant: 'default' },
    inactive: { label: 'Inactive', variant: 'secondary' },
    'out-of-stock': { label: 'Out of Stock', variant: 'destructive' },

    // Payment statuses
    paid: { label: 'Paid', variant: 'default' },
    failed: { label: 'Failed', variant: 'destructive' },
    'payment-pending': { label: 'Pending', variant: 'secondary' },
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
    const config = statusConfig[status.toLowerCase()] || {
        label: status,
        variant: 'outline' as const,
    };

    return (
        <Badge variant={config.variant} className={cn('capitalize', className)}>
            {config.label}
        </Badge>
    );
}
