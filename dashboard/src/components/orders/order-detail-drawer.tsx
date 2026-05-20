import { OrderItemsTable } from "@/components/orders/order-items-table"
import { OrderStatusSelect } from "@/components/orders/order-status-select"
import { PriceText } from "@/components/common/price-text"
import { StatusBadge } from "@/components/common/status-badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { formatDate } from "@/lib/utils"
import type { Order } from "@/types/order"

type OrderDetailDrawerProps = {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated: () => void
}

export function OrderDetailDrawer({
  order,
  open,
  onOpenChange,
  onUpdated,
}: OrderDetailDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        {order ? (
          <>
            <SheetHeader>
              <SheetTitle>Order #{order.id.slice(0, 8)}</SheetTitle>
              <SheetDescription>
                {order.user?.name ?? "Guest customer"} - {formatDate(order.createdAt)}
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-6 px-4 pb-6">
              <div className="grid gap-3 rounded-lg border p-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <div className="mt-2">
                    <StatusBadge status={order.status} />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="mt-2 text-lg font-semibold">
                    <PriceText value={order.totalAmount} />
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Update status</p>
                  <div className="mt-2">
                    <OrderStatusSelect
                      id={order.id}
                      status={order.status}
                      onUpdated={onUpdated}
                    />
                  </div>
                </div>
              </div>
              <OrderItemsTable items={order.items} />
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
