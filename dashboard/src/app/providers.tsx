import type { PropsWithChildren } from "react"
import { SWRConfig } from "swr"
import { Toaster } from "@/components/ui/sonner"
import { fetcher } from "@/lib/api"

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        shouldRetryOnError: false,
      }}
    >
      {children}
      <Toaster richColors position="top-right" />
    </SWRConfig>
  )
}
