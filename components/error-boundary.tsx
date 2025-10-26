"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[v0] Error boundary caught:", error)
  }, [error])

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <Card className="p-12 text-center">
          <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Something went wrong</h1>
          <p className="text-muted-foreground mb-6">
            {error.message || "An unexpected error occurred. Please try again."}
          </p>

          <div className="flex gap-4 justify-center">
            <Button onClick={reset}>Try again</Button>
            <Button asChild variant="outline">
              <a href="/">Go Home</a>
            </Button>
          </div>
        </Card>
      </div>
    </main>
  )
}
