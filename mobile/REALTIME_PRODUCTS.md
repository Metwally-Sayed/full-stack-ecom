# Product Realtime Integration

Use this pattern in the Expo app to refresh product data whenever the admin dashboard creates, edits, activates, deactivates, or deletes a product.

Requirements:

- Install `@supabase/supabase-js`.
- Use `EXPO_PUBLIC_SUPABASE_URL`.
- Use `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- After login, pass the Supabase access token returned by `POST /auth/login` into Realtime with `supabase.realtime.setAuth(accessToken)`.
- Re-fetch the mobile product list from the backend when a `products` change event arrives.

Example:

```ts
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
)

export function subscribeToProductChanges(params: {
  accessToken: string
  refreshProducts: () => void
}) {
  supabase.realtime.setAuth(params.accessToken)

  const channel = supabase
    .channel("mobile-products-realtime")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "products",
      },
      () => {
        params.refreshProducts()
      }
    )
    .subscribe()

  return () => {
    void supabase.removeChannel(channel)
  }
}
```

Before this works, run `backend/src/database/realtime.sql` once in the Supabase SQL Editor.
