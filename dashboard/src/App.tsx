import { BrowserRouter } from "react-router-dom"
import { AppProviders } from "@/app/providers"
import { AppRouter } from "@/app/router"
import { ProductsRealtimeBridge } from "@/components/common/products-realtime-bridge"
import { AuthProvider } from "@/hooks/use-auth"

export function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <AuthProvider>
          <ProductsRealtimeBridge />
          <AppRouter />
        </AuthProvider>
      </AppProviders>
    </BrowserRouter>
  )
}

export default App
