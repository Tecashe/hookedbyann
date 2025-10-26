"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useCart } from "@/lib/cart-context"

interface CartItemProps {
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  color?: string
  size?: string
}

export function CartItemComponent({ productId, name, price, image, quantity, color, size }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <div className="flex gap-4 border-b py-4">
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
        <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="font-semibold">{name}</h3>
          <div className="mt-1 flex gap-4 text-sm text-muted-foreground">
            {color && <span>Color: {color}</span>}
            {size && <span>Size: {size}</span>}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => updateQuantity(productId, quantity - 1, color, size)}>
              −
            </Button>
            <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
            <Button variant="outline" size="sm" onClick={() => updateQuantity(productId, quantity + 1, color, size)}>
              +
            </Button>
          </div>

          <div className="text-right">
            <p className="font-semibold">${((price * quantity) / 100).toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">${(price / 100).toFixed(2)} each</p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeItem(productId, color, size)}
            className="text-destructive hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
