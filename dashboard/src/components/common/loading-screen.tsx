import { Loader2 } from "lucide-react"

export function LoadingScreen() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading dashboard
      </div>
    </div>
  )
}
