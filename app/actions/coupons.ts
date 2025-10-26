// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"
// import { revalidatePath } from "next/cache"

// export async function createCoupon(data: {
//   code: string
//   type: "percentage" | "fixed"
//   discount: number
//   maxUses: number | null
//   minAmount: number | null
//   expiresAt: Date | null
// }) {
//   const { userId } = await auth()

//   if (!userId) {
//     throw new Error("Not authenticated")
//   }

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user || user.role !== "admin") {
//     throw new Error("Not authorized")
//   }

//   const coupon = await db.coupon.create({
//     data: {
//       code: data.code,
//       type: data.type,
//       discount: data.type === "percentage" ? data.discount : data.discount * 100,
//       maxUses: data.maxUses,
//       minAmount: data.minAmount,
//       expiresAt: data.expiresAt,
//     },
//   })

//   revalidatePath("/dashboard/coupons")
//   return coupon
// }

// export async function deleteCoupon(formData: FormData) {
//   const { userId } = await auth()

//   if (!userId) {
//     throw new Error("Not authenticated")
//   }

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user || user.role !== "admin") {
//     throw new Error("Not authorized")
//   }

//   const id = formData.get("id") as string
//   await db.coupon.delete({
//     where: { id },
//   })

//   revalidatePath("/dashboard/coupons")
// }

// export async function validateCoupon(code: string, orderTotal: number) {
//   const coupon = await db.coupon.findUnique({
//     where: { code: code.toUpperCase() },
//   })

//   if (!coupon) {
//     throw new Error("Coupon not found")
//   }

//   if (!coupon.active) {
//     throw new Error("Coupon is inactive")
//   }

//   if (coupon.expiresAt && new Date() > coupon.expiresAt) {
//     throw new Error("Coupon has expired")
//   }

//   if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
//     throw new Error("Coupon usage limit reached")
//   }

//   if (coupon.minAmount && orderTotal < coupon.minAmount) {
//     throw new Error(`Minimum order amount of $${(coupon.minAmount / 100).toFixed(2)} required`)
//   }

//   return coupon
// }


"use server"

import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createCoupon(data: {
  code: string
  type: "percentage" | "fixed"
  discount: number
  maxUses: number | null
  minAmount: number | null
  expiresAt: Date | null
}) {
  await requireAdmin()

  try {
    if (!data.code || !data.code.trim()) {
      throw new Error("Coupon code is required")
    }

    if (data.discount <= 0) {
      throw new Error("Discount must be positive")
    }

    if (data.type === "percentage" && data.discount > 100) {
      throw new Error("Percentage discount cannot exceed 100%")
    }

    const coupon = await db.coupon.create({
      data: {
        code: data.code.toUpperCase().trim(),
        type: data.type,
        discount: data.type === "percentage" ? data.discount : Math.round(data.discount * 100),
        maxUses: data.maxUses,
        minAmount: data.minAmount ? Math.round(data.minAmount * 100) : null,
        expiresAt: data.expiresAt,
      },
    })

    revalidatePath("/dashboard/coupons")
    return coupon
  } catch (error) {
    console.error("[v0] Error creating coupon:", error)
    throw error instanceof Error ? error : new Error("Failed to create coupon")
  }
}

export async function deleteCoupon(formData: FormData) {
  await requireAdmin()

  try {
    const id = formData.get("id") as string
    if (!id) {
      throw new Error("Coupon ID is required")
    }

    await db.coupon.delete({
      where: { id },
    })

    revalidatePath("/dashboard/coupons")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error deleting coupon:", error)
    throw new Error("Failed to delete coupon")
  }
}

export async function validateCoupon(code: string, orderTotal: number) {
  try {
    if (!code || !code.trim()) {
      throw new Error("Coupon code is required")
    }

    const coupon = await db.coupon.findUnique({
      where: { code: code.toUpperCase().trim() },
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

    const discountAmount =
      coupon.type === "percentage" ? Math.round((orderTotal * coupon.discount) / 100) : coupon.discount

    return {
      coupon,
      discountAmount,
      finalTotal: Math.max(0, orderTotal - discountAmount),
    }
  } catch (error) {
    console.error("[v0] Error validating coupon:", error)
    throw error instanceof Error ? error : new Error("Failed to validate coupon")
  }
}

export async function applyCoupon(couponId: string, orderId: string) {
  try {
    await db.coupon.update({
      where: { id: couponId },
      data: {
        usedCount: {
          increment: 1,
        },
      },
    })

    revalidatePath("/checkout/success")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error applying coupon:", error)
    throw new Error("Failed to apply coupon")
  }
}
