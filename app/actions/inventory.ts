"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function updateProductStock(productId: string, newStock: number) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Not authenticated")
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user || user.role !== "admin") {
    throw new Error("Not authorized")
  }

  return await db.product.update({
    where: { id: productId },
    data: { stock: newStock },
  })
}
