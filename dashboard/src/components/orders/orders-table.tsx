import { Eye } from "lucide-react"
import { Link } from "react-router-dom"
import { EmptyState } from "@/components/common/empty-state"
import { PriceText } from "@/components/common/price-text"
import { StatusBadge } from "@/components/common/status-badge"
import { OrderStatusSelect } from "@/components/orders/order-status-select"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate } from "@/lib/utils"
import type { Order } from "@/types/order"

type OrdersTableProps = {
  orders: Order[]
  isLoading: boolean
  onUpdated: () => void
}

export function OrdersTable({ orders, isLoading, onUpdated }: OrdersTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 border-b p-4 last:border-0">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-36" />
          </div>
        ))}
      </div>
    )
  }

  if (!orders.length) {
    return (
      <EmptyState
        title="No orders found"
        description="Orders will appear here as customers complete checkout."
      />
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-28" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-xs">#{order.id.slice(0, 8)}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{order.user?.name ?? "Guest"}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.user?.email ?? "No email"}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <PriceText value={order.totalAmount} />
              </TableCell>
              <TableCell>
                <StatusBadge status={order.status} />
              </TableCell>
              <TableCell>{order.items.length}</TableCell>
              <TableCell>{formatDate(order.createdAt)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <OrderStatusSelect
                    id={order.id}
                    status={order.status}
                    onUpdated={onUpdated}
                  />
                  <Button asChild variant="ghost" size="icon-sm">
                    <Link to={`/orders/${order.id}`}>
                      <Eye className="size-4" />
                      <span className="sr-only">View order</span>
                    </Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
