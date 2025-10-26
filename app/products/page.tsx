"use client"

import { useState, useMemo } from "react"
import { PRODUCTS } from "@/lib/products"
import { ProductCard } from "@/components/product-card"
import { ProductFilters, type FilterState } from "@/components/product-filters"

export default function ProductsPage() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: null,
    colors: [],
    sizes: [],
    priceRange: [0, 500],
    sortBy: "newest",
  })

  // Get unique categories, colors, and sizes
  const categories = useMemo(() => {
    return [...new Set(PRODUCTS.map((p) => p.category))]
  }, [])

  const allColors = useMemo(() => {
    return [...new Set(PRODUCTS.flatMap((p) => p.colors))]
  }, [])

  const allSizes = useMemo(() => {
    return [...new Set(PRODUCTS.flatMap((p) => p.sizes))]
  }, [])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const result = PRODUCTS.filter((product) => {
      // Search filter
      if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }

      // Category filter
      if (filters.category && product.category !== filters.category) {
        return false
      }

      // Color filter
      if (filters.colors.length > 0 && !filters.colors.some((c) => product.colors.includes(c))) {
        return false
      }

      // Size filter
      if (filters.sizes.length > 0 && !filters.sizes.some((s) => product.sizes.includes(s))) {
        return false
      }

      // Price filter
      if (product.priceInCents / 100 < filters.priceRange[0] || product.priceInCents / 100 > filters.priceRange[1]) {
        return false
      }

      return true
    })

    // Sort
    switch (filters.sortBy) {
      case "price-low":
        result.sort((a, b) => a.priceInCents - b.priceInCents)
        break
      case "price-high":
        result.sort((a, b) => b.priceInCents - a.priceInCents)
        break
      case "popular":
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
      case "newest":
      default:
        // Keep original order
        break
    }

    return result
  }, [filters])

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Our Collection</h1>
          <p className="mt-2 text-muted-foreground">
            Discover our handmade crochet pieces, each crafted with love and attention to detail.
          </p>
        </div>
      </div>

      {/* Products Section */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters onFilterChange={setFilters} categories={categories} colors={allColors} sizes={allSizes} />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredProducts.length} of {PRODUCTS.length} products
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="rounded-lg border border-dashed p-12 text-center">
                <p className="text-muted-foreground">No products found matching your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.priceInCents}
                    image={product.images[0]}
                    category={product.category}
                    colors={product.colors}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
