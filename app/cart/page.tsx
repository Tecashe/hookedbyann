"use client"

import { useCart } from "@/lib/cart-context"
import { CartItemComponent } from "@/components/cart-item"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CartPage() {
  const { items, total, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>

          <div className="mt-12 text-center">
            <h1 className="text-3xl font-bold">Your cart is empty</h1>
            <p className="mt-2 text-muted-foreground">Add some beautiful crochet pieces to get started!</p>
            <Button asChild className="mt-6">
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        </div>
      </main>
    )
  }

  const totalInDollars = (total / 100).toFixed(2)

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>

        <h1 className="mt-8 text-3xl font-bold">Shopping Cart</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              {items.map((item) => (
                <CartItemComponent
                  key={`${item.productId}-${item.color}-${item.size}`}
                  productId={item.productId}
                  name={item.name}
                  price={item.price}
                  image={item.image}
                  quantity={item.quantity}
                  color={item.color}
                  size={item.size}
                />
              ))}
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4 p-6">
              <h2 className="text-lg font-semibold">Order Summary</h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${totalInDollars}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>Calculated at checkout</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${totalInDollars}</span>
                  </div>
                </div>
              </div>

              <Button asChild className="mt-6 w-full">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>

              <Button variant="outline" className="mt-3 w-full bg-transparent" onClick={clearCart}>
                Clear Cart
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
