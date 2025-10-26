"use server"

import { db } from "./db"
import { cache } from "react"

export const getProducts = cache(async () => {
  try {
    const products = await db.product.findMany({
      orderBy: { createdAt: "desc" },
    })
    return products
  } catch (error) {
    console.error("[v0] Error fetching products:", error)
    throw new Error("Failed to fetch products")
  }
})

export async function getProductById(id: string) {
  try {
    const product = await db.product.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!product) {
      throw new Error("Product not found")
    }

    return product
  } catch (error) {
    console.error("[v0] Error fetching product:", error)
    throw error
  }
}

export async function getProductsByCategory(category: string) {
  try {
    const products = await db.product.findMany({
      where: { category },
      orderBy: { createdAt: "desc" },
    })
    return products
  } catch (error) {
    console.error("[v0] Error fetching products by category:", error)
    throw error
  }
}

export async function getFeaturedProducts() {
  try {
    const products = await db.product.findMany({
      where: { featured: true },
      take: 6,
    })
    return products
  } catch (error) {
    console.error("[v0] Error fetching featured products:", error)
    throw error
  }
}
