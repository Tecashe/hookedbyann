"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createCoupon(data: {
  code: string
  type: "percentage" | "fixed"
  discount: number
  maxUses: number | null
  minAmount: number | null
  expiresAt: Date | null
}) {
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

  const coupon = await db.coupon.create({
    data: {
      code: data.code,
      type: data.type,
      discount: data.type === "percentage" ? data.discount : data.discount * 100,
      maxUses: data.maxUses,
      minAmount: data.minAmount,
      expiresAt: data.expiresAt,
    },
  })

  revalidatePath("/dashboard/coupons")
  return coupon
}

export async function deleteCoupon(formData: FormData) {
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

  const id = formData.get("id") as string
  await db.coupon.delete({
    where: { id },
  })

  revalidatePath("/dashboard/coupons")
}

export async function validateCoupon(code: string, orderTotal: number) {
  const coupon = await db.coupon.findUnique({
    where: { code: code.toUpperCase() },
  })

  if (!coupon) {
    throw new Error("Coupon not found")
  }

  if (!coupon.active) {
    throw new Error("Coupon is inactive")
  }

  if (coupon.expiresAt && new Date() > coupon.expiresAt) {
    throw new Error("Coupon has expired")
  }

  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    throw new Error("Coupon usage limit reached")
  }

  if (coupon.minAmount && orderTotal < coupon.minAmount) {
    throw new Error(`Minimum order amount of $${(coupon.minAmount / 100).toFixed(2)} required`)
  }

  return coupon
}
