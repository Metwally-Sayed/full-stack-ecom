import { useEffect } from "react"
import { mutate } from "swr"
import { supabase } from "@/lib/supabase"

export function useOrdersRealtime(accessToken?: string | null) {
  useEffect(() => {
    if (!accessToken) {
      return undefined
    }

    supabase.realtime.setAuth(accessToken)

    const channel = supabase
      .channel("admin-orders-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        () => {
          void mutate((key) => typeof key === "string" && key.startsWith("/orders"))
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "order_items",
        },
        () => {
          void mutate((key) => typeof key === "string" && key.startsWith("/orders"))
        }
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [accessToken])
}
