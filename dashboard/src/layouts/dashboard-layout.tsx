import { Outlet } from "react-router-dom"
import { AppHeader } from "@/components/layout/app-header"
import { AppSidebar } from "@/components/layout/app-sidebar"

export function DashboardLayout() {
  return (
    <div className="min-h-svh bg-background">
      <div className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-sidebar lg:block">
        <AppSidebar />
      </div>
      <div className="lg:pl-64">
        <AppHeader />
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
