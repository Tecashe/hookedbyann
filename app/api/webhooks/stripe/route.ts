import { stripe } from "@/lib/stripe"
import { db } from "@/lib/db"
import { headers } from "next/headers"

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return new Response("No signature", { status: 400 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (error) {
    console.error("[v0] Webhook signature verification failed:", error)
    return new Response("Webhook Error", { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as any

        if (session.metadata?.orderId) {
          await db.order.update({
            where: { id: session.metadata.orderId },
            data: {
              status: "processing",
            },
          })

          const orderItems = await db.orderItem.findMany({
            where: { orderId: session.metadata.orderId },
          })

          await Promise.all(
            orderItems.map((item) =>
              db.product.update({
                where: { id: item.productId },
                data: {
                  stock: {
                    decrement: item.quantity,
                  },
                },
              }),
            ),
          )
        }
        break

      case "checkout.session.expired":
        const expiredSession = event.data.object as any

        if (expiredSession.metadata?.orderId) {
          await db.order.update({
            where: { id: expiredSession.metadata.orderId },
            data: {
              status: "cancelled",
            },
          })
        }
        break

      default:
        console.log(`[v0] Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (error) {
    console.error("[v0] Webhook processing error:", error)
    return new Response("Webhook processing error", { status: 500 })
  }
}
