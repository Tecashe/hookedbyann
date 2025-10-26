import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

export default function CheckoutCancelPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <Card className="p-8 text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-amber-600" />
          <h1 className="mt-4 text-3xl font-bold">Checkout Cancelled</h1>
          <p className="mt-2 text-muted-foreground">Your checkout was cancelled. Your cart items are still saved.</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link href="/cart">Back to Cart</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </Card>
      </div>
    </main>
  )
}
