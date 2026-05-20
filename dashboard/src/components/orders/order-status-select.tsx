import { useState } from "react"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getErrorMessage } from "@/lib/utils"
import { updateOrderStatus } from "@/services/orders.service"
import type { OrderStatus } from "@/types/order"

const statuses: OrderStatus[] = ["Pending", "Processing", "Completed", "Cancelled"]

type OrderStatusSelectProps = {
  id: string
  status: OrderStatus
  onUpdated: () => void
}

export function OrderStatusSelect({ id, status, onUpdated }: OrderStatusSelectProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  async function handleChange(nextStatus: OrderStatus) {
    if (nextStatus === status) {
      return
    }

    setIsUpdating(true)

    try {
      await updateOrderStatus(id, nextStatus)
      toast.success("Order status updated")
      onUpdated()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Select
      value={status}
      onValueChange={(value) => void handleChange(value as OrderStatus)}
      disabled={isUpdating}
    >
      <SelectTrigger className="w-36">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statuses.map((item) => (
          <SelectItem key={item} value={item}>
            {item}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
