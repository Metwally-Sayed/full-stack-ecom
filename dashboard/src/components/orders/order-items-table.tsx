import { PriceText } from "@/components/common/price-text"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { OrderItem } from "@/types/order"

export function OrderItemsTable({ items }: { items: OrderItem[] }) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="size-10 overflow-hidden rounded-md bg-muted">
                    {item.productImageUrl ? (
                      <img
                        src={item.productImageUrl}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <span className="font-medium">{item.productName}</span>
                </div>
              </TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>
                <PriceText value={item.unitPrice} />
              </TableCell>
              <TableCell>
                <PriceText value={item.lineTotal} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
