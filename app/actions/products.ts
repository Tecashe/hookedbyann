"use server"

import { db } from "@/lib/db"

export async function getProducts(filters?: {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
}) {
  try {
    const products = await db.product.findMany({
      where: {
        ...(filters?.category && { category: filters.category }),
        ...(filters?.search && {
          name: {
            contains: filters.search,
            mode: "insensitive",
          },
        }),
        ...(filters?.minPrice && {
          price: {
            gte: filters.minPrice,
          },
        }),
        ...(filters?.maxPrice && {
          price: {
            lte: filters.maxPrice,
          },
        }),
      },
      orderBy: { createdAt: "desc" },
    })

    return products
  } catch (error) {
    console.error("[v0] Error fetching products:", error)
    throw new Error("Failed to fetch products")
  }
}

export async function getProductById(id: string) {
  try {
    const product = await db.product.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
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

export async function getFeaturedProducts() {
  try {
    return await db.product.findMany({
      where: { featured: true },
      take: 6,
      orderBy: { createdAt: "desc" },
    })
  } catch (error) {
    console.error("[v0] Error fetching featured products:", error)
    throw new Error("Failed to fetch featured products")
  }
}
