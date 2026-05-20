import { Navigate, Route, Routes } from "react-router-dom"
import { LoadingScreen } from "@/components/common/loading-screen"
import { useAuth } from "@/hooks/use-auth"
import { AuthLayout } from "@/layouts/auth-layout"
import { DashboardLayout } from "@/layouts/dashboard-layout"
import { DashboardPage } from "@/pages/dashboard-page"
import { LoginPage } from "@/pages/login-page"
import { NotFoundPage } from "@/pages/not-found-page"
import { OrderDetailsPage } from "@/pages/order-details-page"
import { OrdersPage } from "@/pages/orders-page"
import { ProductCreatePage } from "@/pages/product-create-page"
import { ProductEditPage } from "@/pages/product-edit-page"
import { ProductsPage } from "@/pages/products-page"
import { Button } from "@/components/ui/button"

function ProtectedRoute() {
  const { isAuthenticated, isLoading, logout, user } = useAuth()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== "admin") {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4 text-center">
        <h1 className="text-2xl font-semibold">Access denied</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Only admin accounts can access the dashboard.
        </p>
        <Button className="mt-6" onClick={logout}>
          Logout
        </Button>
      </div>
    )
  }

  return <DashboardLayout />
}

function DefaultRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingScreen />
  }

  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/new" element={<ProductCreatePage />} />
        <Route path="/products/:id/edit" element={<ProductEditPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="/" element={<DefaultRoute />} />
    </Routes>
  )
}
