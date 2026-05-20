import { api } from '@/lib/api';
import type { Order } from '@/types/order';
import type { PaginatedResponse } from '@/types/api';

export type CreateOrderItem = {
  productId: string;
  quantity: number;
};

export async function getMyOrders(): Promise<PaginatedResponse<Order>> {
  const res = await api.get<PaginatedResponse<Order>>('/orders/my');
  return res.data;
}

export async function createOrder(items: CreateOrderItem[]): Promise<Order> {
  const res = await api.post<{ data: Order }>('/orders', { items });
  return res.data.data;
}
