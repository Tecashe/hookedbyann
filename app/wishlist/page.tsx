import { getWishlist } from "@/app/actions/wishlist"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"
import { WishlistButton } from "@/components/wishlist-button"

export default async function WishlistPage() {
  const wishlistItems = await getWishlist()

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">My Wishlist </h1>

        {wishlistItems.length === 0 ? (
          <Card className="p-12 text-center">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-6">Your wishlist is empty</p>
            <Button asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={`/products/${item.product.id}`}>
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <Image
                      src={item.product.images[0] || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/products/${item.product.id}`}>
                    <h3 className="font-semibold line-clamp-2 hover:text-primary">{item.product.name}</h3>
                  </Link>
                  <p className="mt-2 text-lg font-bold">${(item.product.price / 100).toFixed(2)}</p>
                  <div className="mt-4 flex gap-2">
                    <Button asChild className="flex-1" size="sm">
                      <Link href={`/products/${item.product.id}`}>View</Link>
                    </Button>
                    <WishlistButton productId={item.product.id} isWishlisted={true} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
