import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { createOrder, type CreateOrderItem } from '@/services/orders.service';
import { useCartStore } from '@/stores/cart-store';
import type { Order } from '@/types/order';

export function useCheckout() {
  const queryClient = useQueryClient();
  const clearCart = useCartStore((s) => s.clearCart);

  const mutation = useMutation<Order, Error, CreateOrderItem[]>({
    mutationFn: createOrder,
    onSuccess: (order) => {
      clearCart();
      void queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      router.replace({ pathname: '/checkout/success', params: { orderId: order.id } });
    },
  });

  return mutation;
}
