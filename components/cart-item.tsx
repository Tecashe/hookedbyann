// "use client"

// import Image from "next/image"
// import { Button } from "@/components/ui/button"
// import { X } from "lucide-react"
// import { useCart } from "@/lib/cart-context"

// interface CartItemProps {
//   productId: string
//   name: string
//   price: number
//   image: string
//   quantity: number
//   color?: string
//   size?: string
// }

// export function CartItemComponent({ productId, name, price, image, quantity, color, size }: CartItemProps) {
//   const { updateQuantity, removeItem } = useCart()

//   return (
//     <div className="flex gap-4 border-b py-4">
//       <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
//         <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
//       </div>

//       <div className="flex flex-1 flex-col justify-between">
//         <div>
//           <h3 className="font-semibold">{name}</h3>
//           <div className="mt-1 flex gap-4 text-sm text-muted-foreground">
//             {color && <span>Color: {color}</span>}
//             {size && <span>Size: {size}</span>}
//           </div>
//         </div>

//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Button variant="outline" size="sm" onClick={() => updateQuantity(productId, quantity - 1, color, size)}>
//               −
//             </Button>
//             <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
//             <Button variant="outline" size="sm" onClick={() => updateQuantity(productId, quantity + 1, color, size)}>
//               +
//             </Button>
//           </div>

//           <div className="text-right">
//             <p className="font-semibold">${((price * quantity) / 100).toFixed(2)}</p>
//             <p className="text-xs text-muted-foreground">${(price / 100).toFixed(2)} each</p>
//           </div>

//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => removeItem(productId, color, size)}
//             className="text-destructive hover:text-destructive"
//           >
//             <X className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2 } from "lucide-react"
import { removeFromCart, updateCartItemQuantity } from "@/app/actions/cart"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface CartItemComponentProps {
  productId: string
  cartItemId: string
  name: string
  price: number
  image: string
  quantity: number
  color?: string
  size?: string
}

export function CartItemComponent({
  productId,
  cartItemId,
  name,
  price,
  image,
  quantity,
  color,
  size,
}: CartItemComponentProps) {
  const [currentQuantity, setCurrentQuantity] = useState(quantity)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return

    setLoading(true)
    try {
      await updateCartItemQuantity(cartItemId, newQuantity)
      setCurrentQuantity(newQuantity)
    } catch (error) {
      console.error("[v0] Error updating quantity:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update quantity",
        variant: "destructive",
      })
      setCurrentQuantity(quantity)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async () => {
    setLoading(true)
    try {
      await removeFromCart(cartItemId)
      toast({
        title: "Removed from cart",
        description: `${name} has been removed from your cart.`,
      })
    } catch (error) {
      console.error("[v0] Error removing from cart:", error)
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-4 pb-4 border-b last:border-0">
      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
        <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
      </div>

      <div className="flex-1">
        <p className="font-medium">{name}</p>
        {color && <p className="text-sm text-muted-foreground">Color: {color}</p>}
        {size && <p className="text-sm text-muted-foreground">Size: {size}</p>}
        <p className="text-sm font-semibold mt-2">${(price / 100).toFixed(2)}</p>
      </div>

      <div className="flex items-center gap-2">
        <Input
          type="number"
          min="1"
          value={currentQuantity}
          onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value))}
          disabled={loading}
          className="w-16 text-center"
        />
        <Button
          onClick={handleRemove}
          disabled={loading}
          variant="ghost"
          size="icon"
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
