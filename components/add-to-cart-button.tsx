"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { addToCart } from "@/app/actions/cart"
import { useToast } from "@/hooks/use-toast"

interface AddToCartButtonProps {
  productId: string
  productName: string
  price: number
  color?: string
  size?: string
}

export function AddToCartButton({ productId, productName, price, color, size }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleAddToCart = async () => {
    setLoading(true)
    try {
      await addToCart(productId, 1, color, size)
      toast({
        title: "Added to cart",
        description: `${productName} has been added to your cart.`,
      })
    } catch (error) {
      console.error("[v0] Error adding to cart:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add to cart",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleAddToCart} disabled={loading} className="flex-1">
      <ShoppingCart className="h-4 w-4 mr-2" />
      {loading ? "Adding..." : "Add to Cart"}
    </Button>
  )
}
