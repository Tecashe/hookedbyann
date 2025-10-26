// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { ChevronDown } from "lucide-react"

// interface ProductFiltersProps {
//   onFilterChange: (filters: FilterState) => void
//   categories: string[]
//   colors: string[]
//   sizes: string[]
// }

// export interface FilterState {
//   search: string
//   category: string | null
//   colors: string[]
//   sizes: string[]
//   priceRange: [number, number]
//   sortBy: "newest" | "price-low" | "price-high" | "popular"
// }

// export function ProductFilters({ onFilterChange, categories, colors, sizes }: ProductFiltersProps) {
//   const [filters, setFilters] = useState<FilterState>({
//     search: "",
//     category: null,
//     colors: [],
//     sizes: [],
//     priceRange: [0, 500],
//     sortBy: "newest",
//   })

//   const [expandedSections, setExpandedSections] = useState({
//     category: true,
//     colors: true,
//     sizes: true,
//     price: true,
//   })

//   const handleFilterChange = (newFilters: Partial<FilterState>) => {
//     const updated = { ...filters, ...newFilters }
//     setFilters(updated)
//     onFilterChange(updated)
//   }

//   const toggleSection = (section: keyof typeof expandedSections) => {
//     setExpandedSections((prev) => ({
//       ...prev,
//       [section]: !prev[section],
//     }))
//   }

//   return (
//     <div className="space-y-4">
//       {/* Search */}
//       <Card className="p-4">
//         <input
//           type="text"
//           placeholder="Search products..."
//           value={filters.search}
//           onChange={(e) => handleFilterChange({ search: e.target.value })}
//           className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//         />
//       </Card>

//       {/* Sort */}
//       <Card className="p-4">
//         <label className="text-sm font-semibold block mb-3">Sort By</label>
//         <select
//           value={filters.sortBy}
//           onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
//           className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//         >
//           <option value="newest">Newest</option>
//           <option value="price-low">Price: Low to High</option>
//           <option value="price-high">Price: High to Low</option>
//           <option value="popular">Most Popular</option>
//         </select>
//       </Card>

//       {/* Category Filter */}
//       <Card className="p-4">
//         <button
//           onClick={() => toggleSection("category")}
//           className="w-full flex items-center justify-between font-semibold mb-3"
//         >
//           Category
//           <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.category ? "rotate-180" : ""}`} />
//         </button>
//         {expandedSections.category && (
//           <div className="space-y-2">
//             {categories.map((cat) => (
//               <label key={cat} className="flex items-center gap-2 cursor-pointer">
//                 <input
//                   type="radio"
//                   name="category"
//                   value={cat}
//                   checked={filters.category === cat}
//                   onChange={(e) => handleFilterChange({ category: e.target.value })}
//                   className="rounded"
//                 />
//                 <span className="text-sm">{cat}</span>
//               </label>
//             ))}
//             {filters.category && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => handleFilterChange({ category: null })}
//                 className="w-full justify-start text-xs"
//               >
//                 Clear
//               </Button>
//             )}
//           </div>
//         )}
//       </Card>

//       {/* Color Filter */}
//       <Card className="p-4">
//         <button
//           onClick={() => toggleSection("colors")}
//           className="w-full flex items-center justify-between font-semibold mb-3"
//         >
//           Colors
//           <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.colors ? "rotate-180" : ""}`} />
//         </button>
//         {expandedSections.colors && (
//           <div className="space-y-2">
//             {colors.map((color) => (
//               <label key={color} className="flex items-center gap-2 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={filters.colors.includes(color)}
//                   onChange={(e) => {
//                     const newColors = e.target.checked
//                       ? [...filters.colors, color]
//                       : filters.colors.filter((c) => c !== color)
//                     handleFilterChange({ colors: newColors })
//                   }}
//                   className="rounded"
//                 />
//                 <span className="text-sm">{color}</span>
//               </label>
//             ))}
//             {filters.colors.length > 0 && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => handleFilterChange({ colors: [] })}
//                 className="w-full justify-start text-xs"
//               >
//                 Clear
//               </Button>
//             )}
//           </div>
//         )}
//       </Card>

//       {/* Size Filter */}
//       <Card className="p-4">
//         <button
//           onClick={() => toggleSection("sizes")}
//           className="w-full flex items-center justify-between font-semibold mb-3"
//         >
//           Sizes
//           <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.sizes ? "rotate-180" : ""}`} />
//         </button>
//         {expandedSections.sizes && (
//           <div className="space-y-2">
//             {sizes.map((size) => (
//               <label key={size} className="flex items-center gap-2 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={filters.sizes.includes(size)}
//                   onChange={(e) => {
//                     const newSizes = e.target.checked
//                       ? [...filters.sizes, size]
//                       : filters.sizes.filter((s) => s !== size)
//                     handleFilterChange({ sizes: newSizes })
//                   }}
//                   className="rounded"
//                 />
//                 <span className="text-sm">{size}</span>
//               </label>
//             ))}
//             {filters.sizes.length > 0 && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => handleFilterChange({ sizes: [] })}
//                 className="w-full justify-start text-xs"
//               >
//                 Clear
//               </Button>
//             )}
//           </div>
//         )}
//       </Card>

//       {/* Price Filter */}
//       <Card className="p-4">
//         <button
//           onClick={() => toggleSection("price")}
//           className="w-full flex items-center justify-between font-semibold mb-3"
//         >
//           Price Range
//           <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.price ? "rotate-180" : ""}`} />
//         </button>
//         {expandedSections.price && (
//           <div className="space-y-3">
//             <div>
//               <label className="text-xs font-medium">Min: ${filters.priceRange[0]}</label>
//               <input
//                 type="range"
//                 min="0"
//                 max="500"
//                 value={filters.priceRange[0]}
//                 onChange={(e) =>
//                   handleFilterChange({
//                     priceRange: [Number.parseInt(e.target.value), filters.priceRange[1]],
//                   })
//                 }
//                 className="w-full"
//               />
//             </div>
//             <div>
//               <label className="text-xs font-medium">Max: ${filters.priceRange[1]}</label>
//               <input
//                 type="range"
//                 min="0"
//                 max="500"
//                 value={filters.priceRange[1]}
//                 onChange={(e) =>
//                   handleFilterChange({
//                     priceRange: [filters.priceRange[0], Number.parseInt(e.target.value)],
//                   })
//                 }
//                 className="w-full"
//               />
//             </div>
//           </div>
//         )}
//       </Card>
//     </div>
//   )
// }

"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter, useSearchParams } from "next/navigation"

export interface FilterState {
  search: string
  category: string | null
  colors: string[]
  sizes: string[]
  priceRange: [number, number]
  sortBy: string
}

interface ProductFiltersProps {
  categories: string[]
  colors: string[]
  sizes: string[]
  onFilterChange?: (filters: FilterState) => void
}

export function ProductFilters({ categories, colors, sizes, onFilterChange }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "")
  const [selectedColors, setSelectedColors] = useState<string[]>(searchParams.getAll("colors") || [])
  const [selectedSizes, setSelectedSizes] = useState<string[]>(searchParams.getAll("sizes") || [])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "newest")

  const handleApplyFilters = () => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (selectedCategory) params.set("category", selectedCategory)
    selectedColors.forEach((c) => params.append("colors", c))
    selectedSizes.forEach((s) => params.append("sizes", s))
    params.set("priceRange", JSON.stringify(priceRange))
    params.set("sortBy", sortBy)

    router.push(`/products?${params.toString()}`)

    onFilterChange?.({
      search,
      category: selectedCategory || null,
      colors: selectedColors,
      sizes: selectedSizes,
      priceRange,
      sortBy,
    })
  }

  const handleReset = () => {
    setSearch("")
    setSelectedCategory("")
    setSelectedColors([])
    setSelectedSizes([])
    setPriceRange([0, 500])
    setSortBy("newest")
    router.push("/products")
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Search</h3>
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4"
        />

        <h3 className="font-semibold mb-4 mt-6">Category</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selectedCategory === cat}
                onCheckedChange={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
              />
              <span className="text-sm">{cat}</span>
            </label>
          ))}
        </div>

        <h3 className="font-semibold mb-4 mt-6">Colors</h3>
        <div className="space-y-2">
          {colors.map((color) => (
            <label key={color} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selectedColors.includes(color)}
                onCheckedChange={() =>
                  setSelectedColors(
                    selectedColors.includes(color)
                      ? selectedColors.filter((c) => c !== color)
                      : [...selectedColors, color],
                  )
                }
              />
              <span className="text-sm">{color}</span>
            </label>
          ))}
        </div>

        <h3 className="font-semibold mb-4 mt-6">Sizes</h3>
        <div className="space-y-2">
          {sizes.map((size) => (
            <label key={size} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selectedSizes.includes(size)}
                onCheckedChange={() =>
                  setSelectedSizes(
                    selectedSizes.includes(size) ? selectedSizes.filter((s) => s !== size) : [...selectedSizes, size],
                  )
                }
              />
              <span className="text-sm">{size}</span>
            </label>
          ))}
        </div>

        <h3 className="font-semibold mb-4 mt-6">Sort By</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-sm"
        >
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="popular">Most Popular</option>
        </select>

        <div className="flex gap-2 mt-6">
          <Button onClick={handleApplyFilters} className="flex-1">
            Apply Filters
          </Button>
          <Button onClick={handleReset} variant="outline" className="flex-1 bg-transparent">
            Reset
          </Button>
        </div>
      </Card>
    </div>
  )
}
