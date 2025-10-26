"use server"

import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

interface CheckoutItem {
  productId: string
  quantity: number
  price: number
  color?: string
  size?: string
}

export async function createCheckoutSession(
  items: CheckoutItem[],
  shippingAddress: string,
  email: string,
  phone: string,
) {
  try {
    const lineItems = await Promise.all(
      items.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        })

        if (!product) {
          throw new Error(`Product ${item.productId} not found`)
        }

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.price,
          },
          quantity: item.quantity,
        }
      }),
    )

    const user = await getCurrentUser()
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId: user?.id || "guest",
        totalPrice,
        status: "pending",
        shippingAddress,
        email,
        phone,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            color: item.color,
            size: item.size,
          })),
        },
      },
    })

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      redirect_on_completion: "never",
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
      metadata: {
        orderId: order.id,
      },
    })

    // Update order with Stripe session Id
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.client_secret },
    })

    return { clientSecret: session.client_secret, orderId: order.id }
  } catch (error) {
    console.error("Checkout error:", error)
    throw error
  }
}

export async function getCheckoutSessionStatus(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return {
      status: session.payment_status,
      customer_email: session.customer_details?.email,
    }
  } catch (error) {
    console.error("Session retrieval error:", error)
    throw error
  }
}

export async function updateOrderStatus(orderId: string, status: "paid" | "processing" | "shipped" | "delivered") {
  try {
    return await prisma.order.update({
      where: { id: orderId },
      data: { status },
    })
  } catch (error) {
    console.error("Order update error:", error)
    throw error
  }
}
