// "use client"

// import { useState, useMemo } from "react"
// import { PRODUCTS } from "@/lib/products"
// import { ProductCard } from "@/components/product-card"
// import { ProductFilters, type FilterState } from "@/components/product-filters"

// export default function ProductsPage() {
//   const [filters, setFilters] = useState<FilterState>({
//     search: "",
//     category: null,
//     colors: [],
//     sizes: [],
//     priceRange: [0, 500],
//     sortBy: "newest",
//   })

//   // Get unique categories, colors, and sizes
//   const categories = useMemo(() => {
//     return [...new Set(PRODUCTS.map((p) => p.category))]
//   }, [])

//   const allColors = useMemo(() => {
//     return [...new Set(PRODUCTS.flatMap((p) => p.colors))]
//   }, [])

//   const allSizes = useMemo(() => {
//     return [...new Set(PRODUCTS.flatMap((p) => p.sizes))]
//   }, [])

//   // Filter and sort products
//   const filteredProducts = useMemo(() => {
//     const result = PRODUCTS.filter((product) => {
//       // Search filter
//       if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
//         return false
//       }

//       // Category filter
//       if (filters.category && product.category !== filters.category) {
//         return false
//       }

//       // Color filter
//       if (filters.colors.length > 0 && !filters.colors.some((c) => product.colors.includes(c))) {
//         return false
//       }

//       // Size filter
//       if (filters.sizes.length > 0 && !filters.sizes.some((s) => product.sizes.includes(s))) {
//         return false
//       }

//       // Price filter
//       if (product.priceInCents / 100 < filters.priceRange[0] || product.priceInCents / 100 > filters.priceRange[1]) {
//         return false
//       }

//       return true
//     })

//     // Sort
//     switch (filters.sortBy) {
//       case "price-low":
//         result.sort((a, b) => a.priceInCents - b.priceInCents)
//         break
//       case "price-high":
//         result.sort((a, b) => b.priceInCents - a.priceInCents)
//         break
//       case "popular":
//         result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
//         break
//       case "newest":
//       default:
//         // Keep original order
//         break
//     }

//     return result
//   }, [filters])

//   return (
//     <main className="min-h-screen bg-background">
//       {/* Header */}
//       <div className="border-b bg-card">
//         <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
//           <h1 className="text-4xl font-bold">Our Collection</h1>
//           <p className="mt-2 text-muted-foreground">
//             Discover our handmade crochet pieces, each crafted with love and attention to detail.
//           </p>
//         </div>
//       </div>

//       {/* Products Section */}
//       <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
//         <div className="grid gap-8 lg:grid-cols-4">
//           {/* Filters Sidebar */}
//           <div className="lg:col-span-1">
//             <ProductFilters onFilterChange={setFilters} categories={categories} colors={allColors} sizes={allSizes} />
//           </div>

//           {/* Products Grid */}
//           <div className="lg:col-span-3">
//             <div className="mb-6 flex items-center justify-between">
//               <p className="text-sm text-muted-foreground">
//                 Showing {filteredProducts.length} of {PRODUCTS.length} products
//               </p>
//             </div>

//             {filteredProducts.length === 0 ? (
//               <div className="rounded-lg border border-dashed p-12 text-center">
//                 <p className="text-muted-foreground">No products found matching your filters.</p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//                 {filteredProducts.map((product) => (
//                   <ProductCard
//                     key={product.id}
//                     id={product.id}
//                     name={product.name}
//                     price={product.priceInCents}
//                     image={product.images[0]}
//                     category={product.category}
//                     colors={product.colors}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </main>
//   )
// }

import { Suspense } from "react"
import { getProducts } from "@/app/actions/products"
import { ProductCard } from "@/components/product-card"
import { ProductFilters, type FilterState } from "@/components/product-filters"
import { Skeleton } from "@/components/ui/skeleton"

async function ProductsGrid({ filters }: { filters: FilterState }) {
  try {
    const products = await getProducts()

    const filteredProducts = products.filter((product) => {
      if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }
      if (filters.category && product.category !== filters.category) {
        return false
      }
      if (filters.colors.length > 0 && !filters.colors.some((c) => product.colors.includes(c))) {
        return false
      }
      if (filters.sizes.length > 0 && !filters.sizes.some((s) => product.sizes.includes(s))) {
        return false
      }
      if (product.price / 100 < filters.priceRange[0] || product.price / 100 > filters.priceRange[1]) {
        return false
      }
      return true
    })

    switch (filters.sortBy) {
      case "price-low":
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      case "popular":
        filteredProducts.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
    }

    return (
      <>
        <p className="text-sm text-muted-foreground mb-6">
          Showing {filteredProducts.length} of {products.length} products
        </p>

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
                price={product.price}
                image={product.images[0]}
                category={product.category}
                colors={product.colors}
              />
            ))}
          </div>
        )}
      </>
    )
  } catch (error) {
    console.error("[v0] Error loading products:", error)
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-red-600">Failed to load products. Please try again later.</p>
      </div>
    )
  }
}

function ProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="aspect-square rounded-lg" />
      ))}
    </div>
  )
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const filters: FilterState = {
    search: (params.search as string) || "",
    category: (params.category as string) || null,
    colors: (params.colors as string[]) || [],
    sizes: (params.sizes as string[]) || [],
    priceRange: params.priceRange ? JSON.parse(params.priceRange as string) : [0, 500],
    sortBy: (params.sortBy as string) || "newest",
  }

  try {
    const products = await getProducts()
    const categories = [...new Set(products.map((p) => p.category))]
    const allColors = [...new Set(products.flatMap((p) => p.colors))]
    const allSizes = [...new Set(products.flatMap((p) => p.sizes))]

    return (
      <main className="min-h-screen bg-background">
        <div className="border-b bg-card">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold">Our Collection</h1>
            <p className="mt-2 text-muted-foreground">
              Discover our handmade crochet pieces, each crafted with love and attention to detail.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <ProductFilters onFilterChange={() => {}} categories={categories} colors={allColors} sizes={allSizes} />
            </div>

            <div className="lg:col-span-3">
              <Suspense fallback={<ProductsGridSkeleton />}>
                <ProductsGrid filters={filters} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    )
  } catch (error) {
    console.error("[v0] Error loading page:", error)
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-red-600">Failed to load products page. Please try again later.</p>
        </div>
      </main>
    )
  }
}
