import { Boxes, Clock, DollarSign, ReceiptText } from "lucide-react"
import { ErrorState } from "@/components/common/error-state"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { RecentOrdersTable } from "@/components/dashboard/recent-orders-table"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { formatCurrency } from "@/lib/utils"

export function DashboardPage() {
  const { stats, recentOrders, isLoading, isError } = useDashboardStats()

  if (isError) {
    return <ErrorState />
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="A quick operational view of today's store activity."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-lg" />
          ))
        ) : (
          <>
            <KpiCard
              title="Orders Today"
              value={stats.ordersToday}
              icon={<ReceiptText className="size-5" />}
            />
            <KpiCard
              title="Revenue"
              value={formatCurrency(stats.revenue)}
              icon={<DollarSign className="size-5" />}
            />
            <KpiCard
              title="Active Products"
              value={stats.activeProducts}
              icon={<Boxes className="size-5" />}
            />
            <KpiCard
              title="Pending Orders"
              value={stats.pendingOrders}
              icon={<Clock className="size-5" />}
            />
          </>
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent orders</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentOrdersTable orders={recentOrders} isLoading={isLoading} />
        </CardContent>
      </Card>
    </>
  )
}
