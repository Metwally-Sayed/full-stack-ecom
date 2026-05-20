import { useAuth } from "@/hooks/use-auth"
import { useProductsRealtime } from "@/hooks/use-products-realtime"
import { getAccessToken } from "@/lib/auth"

export function ProductsRealtimeBridge() {
  const { isAuthenticated } = useAuth()

  useProductsRealtime(isAuthenticated ? getAccessToken() : null)

  return null
}
