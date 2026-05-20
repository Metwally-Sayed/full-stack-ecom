import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"

type KpiCardProps = {
  title: string
  value: string | number
  icon: ReactNode
}

export function KpiCard({ title, value, icon }: KpiCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-semibold tracking-normal">{value}</p>
        </div>
        <div className="flex size-11 items-center justify-center rounded-md bg-muted text-muted-foreground">
          {icon}
        </div>
      </CardContent>
    </Card>
  )
}
