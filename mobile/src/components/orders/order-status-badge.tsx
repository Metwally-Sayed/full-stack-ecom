import { OrderStatusBadge } from '@/components/ui/badge';
import type { OrderStatus } from '@/types/order';

export function OrderStatusBadgeComponent({ status }: { status: OrderStatus }) {
  return <OrderStatusBadge status={status} />;
}
