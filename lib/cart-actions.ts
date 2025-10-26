"use server"

import { db } from "./db"
import { getOrCreateUser } from "./auth"
import { revalidatePath } from "next/cache"

export interface CartItem {
  id: string
  productId: string
  quantity: number
  color?: string
  size?: string
  createdAt: Date
  updatedAt: Date
}

export async function getCart() {
  try {
    const user = await getOrCreateUser()

    let cart = await db.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!cart) {
      cart = await db.cart.create({
        data: {
          userId: user.id,
          items: {
            create: [],
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })
    }

    return cart
  } catch (error) {
    console.error("[v0] Error fetching cart:", error)
    throw new Error("Failed to fetch cart")
  }
}

export async function addToCart(productId: string, quantity: number, color?: string, size?: string) {
  try {
    const user = await getOrCreateUser()

    const product = await db.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      throw new Error("Product not found")
    }

    if (product.stock < quantity) {
      throw new Error("Insufficient stock")
    }

    let cart = await db.cart.findUnique({
      where: { userId: user.id },
    })

    if (!cart) {
      cart = await db.cart.create({
        data: { userId: user.id },
      })
    }

    const existingItem = await db.cartItem.findUnique({
      where: {
        cartId_productId_color_size: {
          cartId: cart.id,
          productId,
          color: color || "",
          size: size || "",
        },
      },
    })

    if (existingItem) {
      await db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      })
    } else {
      await db.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          color,
          size,
        },
      })
    }

    revalidatePath("/cart")
    revalidatePath("/checkout")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error adding to cart:", error)
    throw error
  }
}

export async function removeFromCart(cartItemId: string) {
  try {
    const user = await getOrCreateUser()

    const cartItem = await db.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    })

    if (!cartItem || cartItem.cart.userId !== user.id) {
      throw new Error("Cart item not found")
    }

    await db.cartItem.delete({
      where: { id: cartItemId },
    })

    revalidatePath("/cart")
    revalidatePath("/checkout")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error removing from cart:", error)
    throw error
  }
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  try {
    const user = await getOrCreateUser()

    const cartItem = await db.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true, product: true },
    })

    if (!cartItem || cartItem.cart.userId !== user.id) {
      throw new Error("Cart item not found")
    }

    if (quantity <= 0) {
      await db.cartItem.delete({
        where: { id: cartItemId },
      })
    } else {
      if (cartItem.product.stock < quantity) {
        throw new Error("Insufficient stock")
      }

      await db.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
      })
    }

    revalidatePath("/cart")
    revalidatePath("/checkout")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error updating cart item:", error)
    throw error
  }
}

export async function clearCart() {
  try {
    const user = await getOrCreateUser()

    const cart = await db.cart.findUnique({
      where: { userId: user.id },
    })

    if (cart) {
      await db.cartItem.deleteMany({
        where: { cartId: cart.id },
      })
    }

    revalidatePath("/cart")
    revalidatePath("/checkout")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error clearing cart:", error)
    throw error
  }
}
