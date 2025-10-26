"use client"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toggleWishlist } from "@/app/actions/wishlist"
import { useUser } from "@clerk/nextjs"

interface WishlistButtonProps {
  productId: string
  isWishlisted: boolean
}

export function WishlistButton({ productId, isWishlisted: initialWishlisted }: WishlistButtonProps) {
  const { isSignedIn } = useUser() || { isSignedIn: false }
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    if (!isSignedIn) {
      alert("Please sign in to add items to your wishlist")
      return
    }

    setIsLoading(true)
    try {
      await toggleWishlist(productId)
      setIsWishlisted(!isWishlisted)
    } catch (error) {
      alert("Failed to update wishlist")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="outline" size="icon" onClick={handleToggle} disabled={isLoading} className="bg-transparent">
      <Heart
        className={`h-5 w-5 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
      />
    </Button>
  )
}
