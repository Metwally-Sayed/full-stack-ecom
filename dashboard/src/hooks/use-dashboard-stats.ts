import { useOrders } from "@/hooks/use-orders"
import { useProducts } from "@/hooks/use-products"

export function useDashboardStats() {
  const productsState = useProducts({ limit: 100 })
  const ordersState = useOrders({ limit: 100 })
  const today = new Date().toDateString()

  const ordersToday = ordersState.orders.filter(
    (order) => new Date(order.createdAt).toDateString() === today
  ).length
  const revenue = ordersState.orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  )
  const activeProducts = productsState.products.filter(
    (product) => product.isActive
  ).length
  const pendingOrders = ordersState.orders.filter(
    (order) => order.status === "Pending"
  ).length

  return {
    stats: {
      ordersToday,
      revenue,
      activeProducts,
      pendingOrders,
    },
    recentOrders: ordersState.orders
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5),
    isLoading: productsState.isLoading || ordersState.isLoading,
    isError: productsState.isError || ordersState.isError,
  }
}
