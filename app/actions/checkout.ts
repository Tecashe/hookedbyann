// "use server"

// import { stripe } from "@/lib/stripe"
// import { db } from "@/lib/db"
// import { getOrCreateUser } from "@/lib/auth"
// import { clearCart } from "@/lib/cart-actions"
// import { revalidatePath } from "next/cache"

// interface CheckoutItem {
//   productId: string
//   quantity: number
//   price: number
//   color?: string
//   size?: string
// }

// export async function createCheckoutSession(
//   items: CheckoutItem[],
//   shippingAddress: string,
//   email: string,
//   phone: string,
// ) {
//   try {
//     if (!items || items.length === 0) {
//       throw new Error("Cart is empty")
//     }

//     const products = await Promise.all(
//       items.map(async (item) => {
//         const product = await db.product.findUnique({
//           where: { id: item.productId },
//         })

//         if (!product) {
//           throw new Error(`Product ${item.productId} not found`)
//         }

//         if (product.stock < item.quantity) {
//           throw new Error(`Insufficient stock for ${product.name}`)
//         }

//         return product
//       }),
//     )

//     const lineItems = items.map((item, idx) => ({
//       price_data: {
//         currency: "usd",
//         product_data: {
//           name: products[idx].name,
//           description: products[idx].description,
//           images: products[idx].images,
//         },
//         unit_amount: products[idx].price,
//       },
//       quantity: item.quantity,
//     }))

//     const user = await getOrCreateUser()
//     const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

//     const order = await db.order.create({
//       data: {
//         userId: user.id,
//         totalPrice,
//         status: "pending",
//         shippingAddress,
//         email,
//         phone,
//         items: {
//           create: items.map((item) => ({
//             productId: item.productId,
//             quantity: item.quantity,
//             price: item.price,
//             color: item.color,
//             size: item.size,
//           })),
//         },
//       },
//     })

//     const session = await stripe.checkout.sessions.create({
//       ui_mode: "embedded",
//       redirect_on_completion: "never",
//       line_items: lineItems,
//       mode: "payment",
//       success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
//       cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel?order_id=${order.id}`,
//       metadata: {
//         orderId: order.id,
//         userId: user.id,
//       },
//       customer_email: email,
//     })

//     await db.order.update({
//       where: { id: order.id },
//       data: { stripeSessionId: session.client_secret },
//     })

//     return { clientSecret: session.client_secret, orderId: order.id }
//   } catch (error) {
//     console.error("[v0] Checkout error:", error)
//     throw error instanceof Error ? error : new Error("Failed to create checkout session")
//   }
// }

// export async function getCheckoutSessionStatus(sessionId: string) {
//   try {
//     const session = await stripe.checkout.sessions.retrieve(sessionId)
//     return {
//       status: session.payment_status,
//       customer_email: session.customer_details?.email,
//       paymentStatus: session.payment_status,
//     }
//   } catch (error) {
//     console.error("[v0] Session retrieval error:", error)
//     throw new Error("Failed to retrieve session status")
//   }
// }

// export async function completeOrder(orderId: string) {
//   try {
//     const user = await getOrCreateUser()

//     const order = await db.order.findUnique({
//       where: { id: orderId },
//     })

//     if (!order || order.userId !== user.id) {
//       throw new Error("Order not found")
//     }

//     await db.order.update({
//       where: { id: orderId },
//       data: { status: "processing" },
//     })

//     const orderItems = await db.orderItem.findMany({
//       where: { orderId },
//     })

//     await Promise.all(
//       orderItems.map((item) =>
//         db.product.update({
//           where: { id: item.productId },
//           data: {
//             stock: {
//               decrement: item.quantity,
//             },
//           },
//         }),
//       ),
//     )

//     await clearCart()

//     revalidatePath("/account/orders")
//     revalidatePath("/checkout/success")

//     return { success: true }
//   } catch (error) {
//     console.error("[v0] Error completing order:", error)
//     throw error instanceof Error ? error : new Error("Failed to complete order")
//   }
// }

// export async function cancelOrder(orderId: string) {
//   try {
//     const user = await getOrCreateUser()

//     const order = await db.order.findUnique({
//       where: { id: orderId },
//     })

//     if (!order || order.userId !== user.id) {
//       throw new Error("Order not found")
//     }

//     await db.order.update({
//       where: { id: orderId },
//       data: { status: "cancelled" },
//     })

//     revalidatePath("/account/orders")

//     return { success: true }
//   } catch (error) {
//     console.error("[v0] Error cancelling order:", error)
//     throw error instanceof Error ? error : new Error("Failed to cancel order")
//   }
// }


"use server"

import { stripe } from "@/lib/stripe"
import { db } from "@/lib/db"
import { requireAuth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

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
    if (!items || items.length === 0) {
      throw new Error("Cart is empty")
    }

    const products = await Promise.all(
      items.map(async (item) => {
        const product = await db.product.findUnique({
          where: { id: item.productId },
        })

        if (!product) {
          throw new Error(`Product ${item.productId} not found`)
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`)
        }

        return product
      }),
    )

    const lineItems = items.map((item, idx) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: products[idx].name,
          description: products[idx].description,
          images: products[idx].images,
        },
        unit_amount: products[idx].price,
      },
      quantity: item.quantity,
    }))

    const user = await requireAuth()
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const order = await db.order.create({
      data: {
        userId: user.id,
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
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel?order_id=${order.id}`,
      metadata: {
        orderId: order.id,
        userId: user.id,
      },
      customer_email: email,
    })

    await db.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.client_secret },
    })

    return { clientSecret: session.client_secret, orderId: order.id }
  } catch (error) {
    console.error("[v0] Checkout error:", error)
    throw error instanceof Error ? error : new Error("Failed to create checkout session")
  }
}

export async function getCheckoutSessionStatus(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return {
      status: session.payment_status,
      customer_email: session.customer_details?.email,
      paymentStatus: session.payment_status,
    }
  } catch (error) {
    console.error("[v0] Session retrieval error:", error)
    throw new Error("Failed to retrieve session status")
  }
}

export async function completeOrder(orderId: string) {
  try {
    const user = await requireAuth()

    const order = await db.order.findUnique({
      where: { id: orderId },
    })

    if (!order || order.userId !== user.id) {
      throw new Error("Order not found or unauthorized")
    }

    await db.order.update({
      where: { id: orderId },
      data: { status: "processing" },
    })

    const orderItems = await db.orderItem.findMany({
      where: { orderId },
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

    const cart = await db.cart.findUnique({
      where: { userId: user.id },
    })

    if (cart) {
      await db.cartItem.deleteMany({
        where: { cartId: cart.id },
      })
    }

    revalidatePath("/account/orders")
    revalidatePath("/checkout/success")

    return { success: true }
  } catch (error) {
    console.error("[v0] Error completing order:", error)
    throw error instanceof Error ? error : new Error("Failed to complete order")
  }
}

export async function cancelOrder(orderId: string) {
  try {
    const user = await requireAuth()

    const order = await db.order.findUnique({
      where: { id: orderId },
    })

    if (!order || order.userId !== user.id) {
      throw new Error("Order not found or unauthorized")
    }

    await db.order.update({
      where: { id: orderId },
      data: { status: "cancelled" },
    })

    revalidatePath("/account/orders")

    return { success: true }
  } catch (error) {
    console.error("[v0] Error cancelling order:", error)
    throw error instanceof Error ? error : new Error("Failed to cancel order")
  }
}
