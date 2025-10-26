// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"

// export async function submitReview(productId: string, rating: number, comment: string) {
//   const { userId } = await auth()

//   if (!userId) {
//     throw new Error("Not authenticated")
//   }

//   if (rating < 1 || rating > 5) {
//     throw new Error("Invalid rating")
//   }

//   if (!comment.trim()) {
//     throw new Error("Comment is required")
//   }

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) {
//     throw new Error("User not found")
//   }

//   // Check if user already reviewed this product
//   const existingReview = await db.review.findUnique({
//     where: {
//       userId_productId: {
//         userId: user.id,
//         productId,
//       },
//     },
//   })

//   if (existingReview) {
//     // Update existing review
//     return await db.review.update({
//       where: { id: existingReview.id },
//       data: {
//         rating,
//         comment,
//       },
//     })
//   }

//   // Create new review
//   return await db.review.create({
//     data: {
//       userId: user.id,
//       productId,
//       rating,
//       comment,
//     },
//   })
// }

// export async function getProductReviews(productId: string) {
//   const reviews = await db.review.findMany({
//     where: { productId },
//     include: {
//       user: {
//         select: {
//           name: true,
//           image: true,
//         },
//       },
//     },
//     orderBy: { createdAt: "desc" },
//   })

//   const averageRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0

//   return {
//     reviews,
//     averageRating,
//     totalReviews: reviews.length,
//   }
// }
"use server"

import { db } from "@/lib/db"
import { requireAuth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function submitReview(productId: string, rating: number, comment: string) {
  try {
    const user = await requireAuth()

    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5")
    }

    if (!comment.trim() || comment.trim().length < 10) {
      throw new Error("Comment must be at least 10 characters")
    }

    const product = await db.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      throw new Error("Product not found")
    }

    const existingReview = await db.review.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
    })

    if (existingReview) {
      // Update existing review
      await db.review.update({
        where: { id: existingReview.id },
        data: {
          rating,
          comment: comment.trim(),
        },
      })
    } else {
      // Create new review
      await db.review.create({
        data: {
          userId: user.id,
          productId,
          rating,
          comment: comment.trim(),
        },
      })
    }

    revalidatePath(`/products/${productId}`)

    return { success: true }
  } catch (error) {
    console.error("[v0] Error submitting review:", error)
    throw error instanceof Error ? error : new Error("Failed to submit review")
  }
}

export async function getProductReviews(productId: string) {
  try {
    const reviews = await db.review.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const averageRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0

    return {
      reviews,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length,
    }
  } catch (error) {
    console.error("[v0] Error fetching reviews:", error)
    return {
      reviews: [],
      averageRating: 0,
      totalReviews: 0,
    }
  }
}
