import { useAuth } from "@/hooks/use-auth"
import { useOrdersRealtime } from "@/hooks/use-orders-realtime"
import { useProductsRealtime } from "@/hooks/use-products-realtime"
import { getAccessToken } from "@/lib/auth"

export function ProductsRealtimeBridge() {
  const { isAuthenticated } = useAuth()
  const accessToken = isAuthenticated ? getAccessToken() : null

  useProductsRealtime(accessToken)
  useOrdersRealtime(accessToken)

  return null
}
