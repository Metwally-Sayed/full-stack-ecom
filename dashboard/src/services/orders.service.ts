import { api } from "@/lib/api"
import type { OrderStatus } from "@/types/order"

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const response = await api.patch(`/orders/${id}/status`, { status })
  return response.data
}
