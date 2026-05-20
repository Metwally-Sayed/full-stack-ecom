import { Link, useParams } from "react-router-dom"
import { ErrorState } from "@/components/common/error-state"
import { PriceText } from "@/components/common/price-text"
import { StatusBadge } from "@/components/common/status-badge"
import { PageHeader } from "@/components/layout/page-header"
import { OrderItemsTable } from "@/components/orders/order-items-table"
import { OrderStatusSelect } from "@/components/orders/order-status-select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useOrders } from "@/hooks/use-orders"
import { formatDate } from "@/lib/utils"

export function OrderDetailsPage() {
  const { id } = useParams()
  const ordersState = useOrders({ limit: 100 })
  const order = ordersState.orders.find((item) => item.id === id)

  if (ordersState.isError) {
    return <ErrorState onRetry={() => void ordersState.mutate()} />
  }

  if (ordersState.isLoading) {
    return <Skeleton className="h-96 rounded-lg" />
  }

  if (!order) {
    return (
      <ErrorState
        title="Order not found"
        description="The backend does not expose GET /orders/:id yet, so this page searches the admin order list."
      />
    )
  }

  return (
    <>
      <PageHeader
        title={`Order #${order.id.slice(0, 8)}`}
        description="Review customer, items, total, and fulfillment status."
        action={
          <Button asChild variant="outline">
            <Link to="/orders">Back to orders</Link>
          </Button>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderItemsTable items={order.items} />
          </CardContent>
        </Card>
        <div className="grid gap-6 self-start">
          <Card>
            <CardHeader>
              <CardTitle>Order summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <StatusBadge status={order.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total</span>
                <PriceText value={order.totalAmount} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <div className="grid gap-2 pt-2">
                <span className="text-muted-foreground">Update status</span>
                <OrderStatusSelect
                  id={order.id}
                  status={order.status}
                  onUpdated={() => void ordersState.mutate()}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{order.user?.name ?? "Guest customer"}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {order.user?.email ?? "No email available"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
