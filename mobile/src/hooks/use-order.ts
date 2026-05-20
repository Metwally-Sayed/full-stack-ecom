import { useOrders } from './use-orders';

export function useOrder(id: string) {
  const { orders, isLoading, isError, refetch } = useOrders();
  const order = orders.find((o) => o.id === id) ?? null;
  return { order, isLoading, isError, refetch };
}
