import { useQuery } from '@tanstack/react-query';
import { getMyOrders } from '@/services/orders.service';

export function useOrders() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['my-orders'],
    queryFn: getMyOrders,
  });

  return {
    orders: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    isError,
    refetch,
  };
}
