import { useState } from "react"
import { ErrorState } from "@/components/common/error-state"
import { PaginationControls } from "@/components/common/pagination-controls"
import { PageHeader } from "@/components/layout/page-header"
import { OrdersTable } from "@/components/orders/orders-table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useOrders } from "@/hooks/use-orders"

export function OrdersPage() {
  const [status, setStatus] = useState("all")
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const ordersState = useOrders({ status, page, limit })

  if (ordersState.isError) {
    return <ErrorState onRetry={() => void ordersState.mutate()} />
  }

  return (
    <>
      <PageHeader
        title="Orders"
        description="Track customer orders and update fulfillment status."
        action={
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        }
      />
      <OrdersTable
        orders={ordersState.orders}
        isLoading={ordersState.isLoading}
        onUpdated={() => void ordersState.mutate()}
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PaginationControls
          page={ordersState.meta.page}
          totalPages={ordersState.meta.totalPages}
          totalItems={ordersState.meta.total}
          onPageChange={setPage}
          isLoading={ordersState.isLoading}
        />
        <div className="w-full sm:w-40">
          <Select
            value={String(limit)}
            onValueChange={(value) => {
              setLimit(Number(value))
              setPage(1)
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 / page</SelectItem>
              <SelectItem value="20">20 / page</SelectItem>
              <SelectItem value="50">50 / page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )
}
