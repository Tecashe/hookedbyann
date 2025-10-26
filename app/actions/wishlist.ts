// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"
// //tyd
// export async function toggleWishlist(productId: string) {
//   const { userId } = await auth()

//   if (!userId) {
//     throw new Error("Not authenticated")
//   }

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) {
//     throw new Error("User not found")
//   }

//   const existing = await db.wishlistItem.findUnique({
//     where: {
//       userId_productId: {
//         userId: user.id,
//         productId,
//       },
//     },
//   })

//   if (existing) {
//     await db.wishlistItem.delete({
//       where: { id: existing.id },
//     })
//   } else {
//     await db.wishlistItem.create({
//       data: {
//         userId: user.id,
//         productId,
//       },
//     })
//   }
// }

// export async function getWishlist() {
//   const { userId } = await auth()

//   if (!userId) {
//     return []
//   }

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) {
//     return []
//   }

//   return await db.wishlistItem.findMany({
//     where: { userId: user.id },
//     include: {
//       product: true,
//     },
//   })
// }

// export async function isProductWishlisted(productId: string) {
//   const { userId } = await auth()

//   if (!userId) {
//     return false
//   }

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) {
//     return false
//   }

//   const wishlistItem = await db.wishlistItem.findUnique({
//     where: {
//       userId_productId: {
//         userId: user.id,
//         productId,
//       },
//     },
//   })

//   return !!wishlistItem
// }

"use server"

import { db } from "@/lib/db"
import { requireAuth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function toggleWishlist(productId: string) {
  try {
    const user = await requireAuth()

    const product = await db.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      throw new Error("Product not found")
    }

    const existing = await db.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
    })

    if (existing) {
      await db.wishlistItem.delete({
        where: { id: existing.id },
      })
    } else {
      await db.wishlistItem.create({
        data: {
          userId: user.id,
          productId,
        },
      })
    }

    revalidatePath("/wishlist")
    revalidatePath(`/products/${productId}`)

    return { success: true }
  } catch (error) {
    console.error("[v0] Error toggling wishlist:", error)
    throw error instanceof Error ? error : new Error("Failed to toggle wishlist")
  }
}

export async function getWishlist() {
  try {
    const user = await requireAuth()

    return await db.wishlistItem.findMany({
      where: { userId: user.id },
      include: {
        product: true,
      },
      orderBy: { createdAt: "desc" },
    })
  } catch (error) {
    console.error("[v0] Error fetching wishlist:", error)
    return []
  }
}

export async function isProductWishlisted(productId: string) {
  try {
    const user = await requireAuth()

    const wishlistItem = await db.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
    })

    return !!wishlistItem
  } catch (error) {
    console.error("[v0] Error checking wishlist:", error)
    return false
  }
}
