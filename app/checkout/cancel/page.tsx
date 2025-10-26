// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import Link from "next/link"
// import { AlertCircle } from "lucide-react"

// export default function CheckoutCancelPage() {
//   return (
//     <main className="min-h-screen bg-background">
//       <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
//         <Card className="p-8 text-center">
//           <AlertCircle className="mx-auto h-16 w-16 text-amber-600" />
//           <h1 className="mt-4 text-3xl font-bold">Checkout Cancelled</h1>
//           <p className="mt-2 text-muted-foreground">Your checkout was cancelled. Your cart items are still saved.</p>

//           <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
//             <Button asChild>
//               <Link href="/cart">Back to Cart</Link>
//             </Button>
//             <Button variant="outline" asChild>
//               <Link href="/products">Continue Shopping</Link>
//             </Button>
//           </div>
//         </Card>
//       </div>
//     </main>
//   )
// }

"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { cancelOrder } from "@/app/actions/checkout"
import { useToast } from "@/hooks/use-toast"

export default function CheckoutCancelPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id")
  const { toast } = useToast()

  useEffect(() => {
    const handleCancel = async () => {
      if (orderId) {
        try {
          await cancelOrder(orderId)
          toast({
            title: "Order Cancelled",
            description: "Your order has been cancelled. Your cart items are still available.",
          })
        } catch (error) {
          console.error("[v0] Error cancelling order:", error)
        }
      }
    }

    handleCancel()
  }, [orderId, toast])

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <Card className="p-12 text-center">
          <AlertCircle className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Checkout Cancelled</h1>
          <p className="text-muted-foreground mb-8">
            Your checkout was cancelled. Your cart items are still available and ready for checkout.
          </p>

          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/cart">Back to Cart</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </Card>
      </div>
    </main>
  )
}
