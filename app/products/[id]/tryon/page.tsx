"use client"

import { PRODUCTS } from "@/lib/products"
import { VirtualTryon } from "@/components/virtual-tryon"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TryOnPage() {
  const params = useParams()
  const productId = params.id as string
  const product = PRODUCTS.find((p) => p.id === productId)

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-muted-foreground">Product not found</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href={`/products/${productId}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Product
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold">Virtual Try-On</h1>
          <p className="mt-2 text-muted-foreground">
            Upload a photo of yourself to see how the {product.name} looks on you!
          </p>
        </div>

        <VirtualTryon productImage={product.images[0]} productName={product.name} colors={product.colors} />
      </div>
    </main>
  )
}
