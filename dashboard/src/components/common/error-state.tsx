import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

type ErrorStateProps = {
  title?: string
  description?: string
  onRetry?: () => void
}

export function ErrorState({
  title = "Unable to load data",
  description = "Check the backend connection and try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-lg border bg-card p-8 text-center">
      <AlertTriangle className="size-8 text-destructive" />
      <h3 className="mt-4 text-sm font-medium text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {onRetry ? (
        <Button className="mt-5" variant="outline" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  )
}
