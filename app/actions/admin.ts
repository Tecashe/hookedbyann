// "use server"

// import { getCurrentUser } from "@/lib/auth"
// import { prisma } from "@/lib/db"
// import { redirect } from "next/navigation"

// export async function checkAdminAccess() {
//   const user = await getCurrentUser()
//   if (!user || user.role !== "admin") {
//     redirect("/")
//   }
//   return user
// }

// export async function getAdminStats() {
//   await checkAdminAccess()

//   const [totalOrders, totalRevenue, totalProducts, recentOrders] = await Promise.all([
//     prisma.order.count(),
//     prisma.order.aggregate({
//       _sum: {
//         totalPrice: true,
//       },
//     }),
//     prisma.product.count(),
//     prisma.order.findMany({
//       take: 5,
//       orderBy: { createdAt: "desc" },
//       include: { user: true },
//     }),
//   ])

//   return {
//     totalOrders,
//     totalRevenue: totalRevenue._sum.totalPrice || 0,
//     totalProducts,
//     recentOrders,
//   }
// }

// export async function getProducts() {
//   await checkAdminAccess()
//   return prisma.product.findMany({
//     orderBy: { createdAt: "desc" },
//   })
// }

// export async function getOrders() {
//   await checkAdminAccess()
//   return prisma.order.findMany({
//     include: { user: true, items: { include: { product: true } } },
//     orderBy: { createdAt: "desc" },
//   })
// }

// export async function updateOrderStatus(orderId: string, status: string) {
//   await checkAdminAccess()
//   return prisma.order.update({
//     where: { id: orderId },
//     data: { status },
//   })
// }

// export async function createProduct(data: {
//   name: string
//   description: string
//   price: number
//   category: string
//   colors: string[]
//   sizes: string[]
//   images: string[]
//   gallery: string[]
//   stock: number
// }) {
//   await checkAdminAccess()
//   return prisma.product.create({ data })
// }

// export async function updateProduct(
//   id: string,
//   data: {
//     name?: string
//     description?: string
//     price?: number
//     category?: string
//     colors?: string[]
//     sizes?: string[]
//     images?: string[]
//     gallery?: string[]
//     stock?: number
//   },
// ) {
//   await checkAdminAccess()
//   return prisma.product.update({
//     where: { id },
//     data,
//   })
// }

// export async function deleteProduct(id: string) {
//   await checkAdminAccess()
//   return prisma.product.delete({
//     where: { id },
//   })
// }

"use server"

import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function checkAdminAccess() {
  return await requireAdmin()
}

export async function getAdminStats() {
  await requireAdmin()

  try {
    const [totalOrders, totalRevenue, totalProducts, totalCustomers, recentOrders] = await Promise.all([
      db.order.count(),
      db.order.aggregate({
        _sum: {
          totalPrice: true,
        },
      }),
      db.product.count(),
      db.user.count({
        where: { role: "customer" },
      }),
      db.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: true },
      }),
    ])

    return {
      totalOrders,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      totalProducts,
      totalCustomers,
      recentOrders,
    }
  } catch (error) {
    console.error("[v0] Error fetching admin stats:", error)
    throw new Error("Failed to fetch admin statistics")
  }
}

export async function getProducts() {
  await requireAdmin()

  try {
    return await db.product.findMany({
      orderBy: { createdAt: "desc" },
    })
  } catch (error) {
    console.error("[v0] Error fetching products:", error)
    throw new Error("Failed to fetch products")
  }
}

export async function getOrders() {
  await requireAdmin()

  try {
    return await db.order.findMany({
      include: { user: true, items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    })
  } catch (error) {
    console.error("[v0] Error fetching orders:", error)
    throw new Error("Failed to fetch orders")
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  await requireAdmin()

  try {
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid status")
    }

    const order = await db.order.update({
      where: { id: orderId },
      data: { status },
    })

    revalidatePath("/dashboard/orders")
    revalidatePath(`/dashboard/orders/${orderId}`)

    return order
  } catch (error) {
    console.error("[v0] Error updating order status:", error)
    throw error instanceof Error ? error : new Error("Failed to update order status")
  }
}

export async function createProduct(data: {
  name: string
  description: string
  price: number
  category: string
  colors: string[]
  sizes: string[]
  images: string[]
  gallery: string[]
  stock: number
}) {
  await requireAdmin()

  try {
    if (!data.name || !data.description || !data.price || !data.category) {
      throw new Error("Missing required fields")
    }

    if (data.price < 0) {
      throw new Error("Price must be positive")
    }

    if (data.stock < 0) {
      throw new Error("Stock must be non-negative")
    }

    const product = await db.product.create({
      data: {
        name: data.name.trim(),
        description: data.description.trim(),
        price: Math.round(data.price * 100),
        category: data.category.trim(),
        colors: data.colors.filter((c) => c.trim()),
        sizes: data.sizes.filter((s) => s.trim()),
        images: data.images.filter((i) => i.trim()),
        gallery: data.gallery.filter((g) => g.trim()),
        stock: data.stock,
      },
    })

    revalidatePath("/dashboard/products")

    return product
  } catch (error) {
    console.error("[v0] Error creating product:", error)
    throw error instanceof Error ? error : new Error("Failed to create product")
  }
}

export async function updateProduct(
  id: string,
  data: {
    name?: string
    description?: string
    price?: number
    category?: string
    colors?: string[]
    sizes?: string[]
    images?: string[]
    gallery?: string[]
    stock?: number
  },
) {
  await requireAdmin()

  try {
    if (data.price !== undefined && data.price < 0) {
      throw new Error("Price must be positive")
    }

    if (data.stock !== undefined && data.stock < 0) {
      throw new Error("Stock must be non-negative")
    }

    const product = await db.product.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name.trim() }),
        ...(data.description && { description: data.description.trim() }),
        ...(data.price !== undefined && { price: Math.round(data.price * 100) }),
        ...(data.category && { category: data.category.trim() }),
        ...(data.colors && { colors: data.colors.filter((c) => c.trim()) }),
        ...(data.sizes && { sizes: data.sizes.filter((s) => s.trim()) }),
        ...(data.images && { images: data.images.filter((i) => i.trim()) }),
        ...(data.gallery && { gallery: data.gallery.filter((g) => g.trim()) }),
        ...(data.stock !== undefined && { stock: data.stock }),
      },
    })

    revalidatePath("/dashboard/products")
    revalidatePath(`/dashboard/products/${id}`)

    return product
  } catch (error) {
    console.error("[v0] Error updating product:", error)
    throw error instanceof Error ? error : new Error("Failed to update product")
  }
}

export async function deleteProduct(id: string) {
  await requireAdmin()

  try {
    await db.product.delete({
      where: { id },
    })

    revalidatePath("/dashboard/products")

    return { success: true }
  } catch (error) {
    console.error("[v0] Error deleting product:", error)
    throw new Error("Failed to delete product")
  }
}
