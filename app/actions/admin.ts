"use server"

import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"

export async function checkAdminAccess() {
  const user = await getCurrentUser()
  if (!user || user.role !== "admin") {
    redirect("/")
  }
  return user
}

export async function getAdminStats() {
  await checkAdminAccess()

  const [totalOrders, totalRevenue, totalProducts, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: {
        totalPrice: true,
      },
    }),
    prisma.product.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: true },
    }),
  ])

  return {
    totalOrders,
    totalRevenue: totalRevenue._sum.totalPrice || 0,
    totalProducts,
    recentOrders,
  }
}

export async function getProducts() {
  await checkAdminAccess()
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  })
}

export async function getOrders() {
  await checkAdminAccess()
  return prisma.order.findMany({
    include: { user: true, items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  })
}

export async function updateOrderStatus(orderId: string, status: string) {
  await checkAdminAccess()
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
  })
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
  await checkAdminAccess()
  return prisma.product.create({ data })
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
  await checkAdminAccess()
  return prisma.product.update({
    where: { id },
    data,
  })
}

export async function deleteProduct(id: string) {
  await checkAdminAccess()
  return prisma.product.delete({
    where: { id },
  })
}
