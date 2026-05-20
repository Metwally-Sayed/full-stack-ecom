import { Badge } from "@/components/ui/badge"

export function ProductStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge
      variant="outline"
      className={
        isActive
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-zinc-200 bg-zinc-50 text-zinc-600"
      }
    >
      {isActive ? "Active" : "Inactive"}
    </Badge>
  )
}
