// "use client"

// import { useEffect, useState } from "react"
// import { useSearchParams } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import Link from "next/link"
// import { CheckCircle } from "lucide-react"
// import { getCheckoutSessionStatus } from "@/app/actions/checkout"
// import { useCart } from "@/lib/cart-context"

// export default function CheckoutSuccessPage() {
//   const searchParams = useSearchParams()
//   const sessionId = searchParams.get("session_id")
//   const { clearCart } = useCart()
//   const [status, setStatus] = useState<any>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     if (sessionId) {
//       getCheckoutSessionStatus(sessionId)
//         .then((data) => {
//           setStatus(data)
//           if (data.status === "paid") {
//             clearCart()
//           }
//         })
//         .catch((error) => console.error("Error:", error))
//         .finally(() => setLoading(false))
//     }
//   }, [sessionId, clearCart])

//   if (loading) {
//     return (
//       <main className="min-h-screen bg-background flex items-center justify-center">
//         <p className="text-muted-foreground">Loading...</p>
//       </main>
//     )
//   }

//   return (
//     <main className="min-h-screen bg-background">
//       <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
//         <Card className="p-8 text-center">
//           <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
//           <h1 className="mt-4 text-3xl font-bold">Order Confirmed!</h1>
//           <p className="mt-2 text-muted-foreground">
//             Thank you for your purchase. Your order has been received and is being prepared for shipment.
//           </p>

//           {status?.customer_email && (
//             <p className="mt-4 text-sm">
//               A confirmation email has been sent to <span className="font-semibold">{status.customer_email}</span>
//             </p>
//           )}

//           <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
//             <Button asChild>
//               <Link href="/products">Continue Shopping</Link>
//             </Button>
//             <Button variant="outline" asChild>
//               <Link href="/orders">View Orders</Link>
//             </Button>
//           </div>
//         </Card>
//       </div>
//     </main>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { completeOrder, getCheckoutSessionStatus } from "@/app/actions/checkout"
import { useToast } from "@/hooks/use-toast"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const orderId = searchParams.get("order_id")
  const [loading, setLoading] = useState(true)
  const [sessionStatus, setSessionStatus] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId || !orderId) {
        toast({
          title: "Error",
          description: "Invalid checkout session",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      try {
        const status = await getCheckoutSessionStatus(sessionId)
        setSessionStatus(status)

        if (status.paymentStatus === "paid") {
          await completeOrder(orderId)
          toast({
            title: "Success",
            description: "Your order has been placed successfully!",
          })
        }
      } catch (error) {
        console.error("[v0] Error verifying payment:", error)
        toast({
          title: "Error",
          description: "Failed to verify payment",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    verifyPayment()
  }, [sessionId, orderId, toast])

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-muted-foreground">Processing your order...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <Card className="p-12 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your purchase. Your order has been placed successfully.
          </p>

          {orderId && (
            <div className="bg-muted p-4 rounded-lg mb-6">
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-mono font-semibold">{orderId}</p>
            </div>
          )}

          <p className="text-muted-foreground mb-8">
            You will receive an email confirmation shortly. You can track your order in your account.
          </p>

          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/account/orders">View Orders</Link>
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
