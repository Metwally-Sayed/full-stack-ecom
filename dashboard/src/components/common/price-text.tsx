import { formatCurrency } from "@/lib/utils"

export function PriceText({ value }: { value: number }) {
  return <span className="font-medium tabular-nums">{formatCurrency(value)}</span>
}
