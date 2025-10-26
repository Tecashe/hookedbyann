// "use client"

// import Link from "next/link"
// import Image from "next/image"
// import { Heart } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"

// interface ProductCardProps {
//   id: string
//   name: string
//   price: number
//   image: string
//   category: string
//   colors: string[]
// }

// export function ProductCard({ id, name, price, image, category, colors }: ProductCardProps) {
//   const priceInDollars = (price / 100).toFixed(2)

//   return (
//     <Link href={`/products/${id}`}>
//       <Card className="group overflow-hidden transition-all hover:shadow-lg">
//         <div className="relative aspect-square overflow-hidden bg-muted">
//           <Image
//             src={image || "/placeholder.svg"}
//             alt={name}
//             fill
//             className="object-cover transition-transform duration-300 group-hover:scale-105"
//           />
//           <button className="absolute right-3 top-3 rounded-full bg-white/80 p-2 backdrop-blur-sm hover:bg-white transition-colors">
//             <Heart className="h-5 w-5" />
//           </button>
//         </div>

//         <div className="p-4">
//           <p className="text-xs text-muted-foreground uppercase tracking-wide">{category}</p>
//           <h3 className="mt-2 font-semibold line-clamp-2">{name}</h3>

//           {/* Color swatches */}
//           <div className="mt-3 flex gap-2">
//             {colors.slice(0, 3).map((color) => (
//               <div key={color} className="h-4 w-4 rounded-full border border-muted-foreground" title={color} />
//             ))}
//             {colors.length > 3 && <span className="text-xs text-muted-foreground">+{colors.length - 3}</span>}
//           </div>

//           <div className="mt-4 flex items-center justify-between">
//             <span className="text-lg font-bold">${priceInDollars}</span>
//             <Button size="sm" variant="outline">
//               View
//             </Button>
//           </div>
//         </div>
//       </Card>
//     </Link>
//   )
// }

"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"
import { useState } from "react"

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  category: string
  colors: string[]
}

export function ProductCard({ id, name, price, image, category, colors }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/products/${id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover hover:scale-105 transition-transform"
          />
        </div>
      </Link>

      <div className="p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">{category}</p>
        <Link href={`/products/${id}`}>
          <h3 className="mt-2 font-semibold hover:text-primary transition-colors">{name}</h3>
        </Link>
        <p className="mt-2 text-lg font-bold">${(price / 100).toFixed(2)}</p>

        {colors.length > 0 && (
          <div className="mt-3 flex gap-2">
            {colors.slice(0, 3).map((color) => (
              <div key={color} className="w-4 h-4 rounded-full border border-muted-foreground" title={color} />
            ))}
            {colors.length > 3 && <span className="text-xs text-muted-foreground">+{colors.length - 3}</span>}
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <Button asChild className="flex-1">
            <Link href={`/products/${id}`}>View</Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={isWishlisted ? "bg-red-50" : ""}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
        </div>
      </div>
    </Card>
  )
}
