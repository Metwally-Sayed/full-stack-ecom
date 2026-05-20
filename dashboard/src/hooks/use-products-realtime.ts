import { useEffect } from "react"
import { mutate } from "swr"
import { supabase } from "@/lib/supabase"

export function useProductsRealtime(accessToken?: string | null) {
  useEffect(() => {
    if (!accessToken) {
      return undefined
    }

    supabase.realtime.setAuth(accessToken)

    const channel = supabase
      .channel("admin-products-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "products",
        },
        () => {
          void mutate((key) => typeof key === "string" && key.startsWith("/products"))
        }
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [accessToken])
}
