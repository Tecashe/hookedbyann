// "use client"

// import { useState } from "react"
// import { PRODUCTS } from "@/lib/products"
// import { ProductGallery } from "@/components/product-gallery"
// import { ColorSelector } from "@/components/color-selector"
// import { SizeSelector } from "@/components/size-selector"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Heart, Share2, Truck, RotateCcw, Sparkles } from "lucide-react"
// import { useParams } from "next/navigation"
// import Link from "next/link"

// export default function ProductDetailPage() {
//   const params = useParams()
//   const productId = params.id as string
//   const product = PRODUCTS.find((p) => p.id === productId)

//   const [selectedColor, setSelectedColor] = useState(product?.colors[0] || "")
//   const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || "")
//   const [quantity, setQuantity] = useState(1)

//   if (!product) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <p className="text-lg text-muted-foreground">Product not found</p>
//       </div>
//     )
//   }

//   const priceInDollars = (product.priceInCents / 100).toFixed(2)

//   return (
//     <main className="min-h-screen bg-background">
//       <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
//         <div className="grid gap-8 lg:grid-cols-2">
//           {/* Gallery */}
//           <div>
//             <ProductGallery
//               images={product.gallery.length > 0 ? product.gallery : product.images}
//               productName={product.name}
//             />
//           </div>

//           {/* Product Info */}
//           <div className="flex flex-col gap-6">
//             <div>
//               <p className="text-sm uppercase tracking-wide text-muted-foreground">{product.category}</p>
//               <h1 className="mt-2 text-4xl font-bold">{product.name}</h1>
//               <p className="mt-4 text-2xl font-semibold">${priceInDollars}</p>
//             </div>

//             <p className="text-base leading-relaxed text-muted-foreground">{product.description}</p>

//             {/* Selectors */}
//             <div className="space-y-6">
//               <ColorSelector colors={product.colors} selectedColor={selectedColor} onColorChange={setSelectedColor} />
//               <SizeSelector sizes={product.sizes} selectedSize={selectedSize} onSizeChange={setSelectedSize} />

//               {/* Quantity */}
//               <div className="space-y-3">
//                 <h3 className="text-sm font-semibold">Quantity</h3>
//                 <div className="flex items-center gap-4">
//                   <Button variant="outline" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
//                     −
//                   </Button>
//                   <span className="w-8 text-center font-semibold">{quantity}</span>
//                   <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}>
//                     +
//                   </Button>
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-3">
//               <Button size="lg" className="flex-1">
//                 Add to Cart
//               </Button>
//               <Button size="lg" variant="outline" className="w-12 bg-transparent">
//                 <Heart className="h-5 w-5" />
//               </Button>
//               <Button size="lg" variant="outline" className="w-12 bg-transparent">
//                 <Share2 className="h-5 w-5" />
//               </Button>
//             </div>

//             {/* Virtual Try-On Button */}
//             <Button asChild variant="outline" size="lg" className="bg-transparent">
//               <Link href={`/products/${productId}/tryon`}>
//                 <Sparkles className="h-5 w-5 mr-2" />
//                 Virtual Try-On
//               </Link>
//             </Button>

//             {/* Info Cards */}
//             <div className="grid gap-3 pt-6">
//               <Card className="flex items-center gap-3 p-4">
//                 <Truck className="h-5 w-5 text-muted-foreground" />
//                 <div>
//                   <p className="font-semibold text-sm">Free Shipping</p>
//                   <p className="text-xs text-muted-foreground">On orders over $50</p>
//                 </div>
//               </Card>
//               <Card className="flex items-center gap-3 p-4">
//                 <RotateCcw className="h-5 w-5 text-muted-foreground" />
//                 <div>
//                   <p className="font-semibold text-sm">Easy Returns</p>
//                   <p className="text-xs text-muted-foreground">30-day return policy</p>
//                 </div>
//               </Card>
//             </div>
//           </div>
//         </div>

//         {/* Related Products Section */}
//         <div className="mt-16 border-t pt-12">
//           <h2 className="text-2xl font-bold">You Might Also Like</h2>
//           <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {PRODUCTS.filter((p) => p.id !== productId)
//               .slice(0, 3)
//               .map((relatedProduct) => (
//                 <div key={relatedProduct.id} className="text-center">
//                   <div className="aspect-square overflow-hidden rounded-lg bg-muted">
//                     <img
//                       src={relatedProduct.images[0] || "/placeholder.svg"}
//                       alt={relatedProduct.name}
//                       className="h-full w-full object-cover"
//                     />
//                   </div>
//                   <h3 className="mt-3 font-semibold">{relatedProduct.name}</h3>
//                   <p className="text-sm text-muted-foreground">${(relatedProduct.priceInCents / 100).toFixed(2)}</p>
//                 </div>
//               ))}
//           </div>
//         </div>
//       </div>
//     </main>
//   )
// }

import { getProductById } from "@/app/actions/products"
import { getProductReviews } from "@/app/actions/reviews"
import { isProductWishlisted } from "@/app/actions/wishlist"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { WishlistButton } from "@/components/wishlist-button"
import { notFound } from "next/navigation"

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const [product, reviewsData, isWishlisted] = await Promise.all([
      getProductById(id),
      getProductReviews(id),
      isProductWishlisted(id).catch(() => false),
    ])

    if (!product) {
      notFound()
    }

    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
          </Button>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                <Image
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {product.gallery && product.gallery.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.gallery.map((image, idx) => (
                    <div key={idx} className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${product.name} ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground">{product.category}</p>
                <h1 className="text-4xl font-bold mt-2">{product.name}</h1>
                <p className="text-3xl font-bold mt-4">${(product.price / 100).toFixed(2)}</p>
              </div>

              <p className="text-muted-foreground leading-relaxed">{product.description}</p>

              {/* Stock Status */}
              <div>
                <p className="text-sm font-medium mb-2">Availability</p>
                <p className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </p>
              </div>

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-3">Colors</p>
                  <div className="flex gap-2 flex-wrap">
                    {product.colors.map((color) => (
                      <button key={color} className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors">
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-3">Sizes</p>
                  <div className="flex gap-2 flex-wrap">
                    {product.sizes.map((size) => (
                      <button key={size} className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors">
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-6">
                <AddToCartButton productId={product.id} productName={product.name} price={product.price} />
                <WishlistButton productId={product.id} initialWishlisted={isWishlisted} />
              </div>

              {/* Reviews Section */}
              {reviewsData.reviews && reviewsData.reviews.length > 0 && (
                <Card className="p-6 mt-8">
                  <h2 className="text-lg font-semibold mb-4">Customer Reviews ({reviewsData.totalReviews})</h2>
                  <p className="text-sm text-muted-foreground mb-4">Average Rating: {reviewsData.averageRating} ⭐</p>
                  <div className="space-y-4">
                    {reviewsData.reviews.map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">{review.user.name}</p>
                          <p className="text-sm text-muted-foreground">{"⭐".repeat(review.rating)}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    )
  } catch (error) {
    console.error("[v0] Error loading product:", error)
    notFound()
  }
}
