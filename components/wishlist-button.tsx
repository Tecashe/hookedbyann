// "use client"

// import { Heart } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { useState } from "react"
// import { toggleWishlist } from "@/app/actions/wishlist"
// import { useUser } from "@clerk/nextjs"

// interface WishlistButtonProps {
//   productId: string
//   isWishlisted: boolean
// }

// export function WishlistButton({ productId, isWishlisted: initialWishlisted }: WishlistButtonProps) {
//   const { isSignedIn } = useUser() || { isSignedIn: false }
//   const [isWishlisted, setIsWishlisted] = useState(initialWishlisted)
//   const [isLoading, setIsLoading] = useState(false)

//   const handleToggle = async () => {
//     if (!isSignedIn) {
//       alert("Please sign in to add items to your wishlist")
//       return
//     }

//     setIsLoading(true)
//     try {
//       await toggleWishlist(productId)
//       setIsWishlisted(!isWishlisted)
//     } catch (error) {
//       alert("Failed to update wishlist")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <Button variant="outline" size="icon" onClick={handleToggle} disabled={isLoading} className="bg-transparent">
//       <Heart
//         className={`h-5 w-5 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
//       />
//     </Button>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { toggleWishlist, isProductWishlisted } from "@/app/actions/wishlist"
import { useToast } from "@/hooks/use-toast"

interface WishlistButtonProps {
  productId: string
  initialWishlisted?: boolean
}

export function WishlistButton({ productId, initialWishlisted = false }: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const wishlisted = await isProductWishlisted(productId)
        setIsWishlisted(wishlisted)
      } catch (error) {
        console.error("[v0] Error checking wishlist:", error)
      }
    }

    checkWishlist()
  }, [productId])

  const handleToggleWishlist = async () => {
    setLoading(true)
    try {
      await toggleWishlist(productId)
      setIsWishlisted(!isWishlisted)
      toast({
        title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
        description: isWishlisted ? "Item removed from your wishlist" : "Item added to your wishlist",
      })
    } catch (error) {
      console.error("[v0] Error toggling wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleToggleWishlist}
      disabled={loading}
      variant="outline"
      size="icon"
      className={isWishlisted ? "bg-red-50" : ""}
    >
      <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
    </Button>
  )
}
