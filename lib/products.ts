export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  category: string
  colors: string[]
  sizes: string[]
  images: string[]
  gallery: string[]
  stock: number
  featured: boolean
}

// This is the source of truth for all products
export const PRODUCTS: Product[] = [
  {
    id: "cozy-cardigan-cream",
    name: "Cozy Oversized Cardigan",
    description:
      "A luxuriously soft oversized cardigan perfect for layering. Hand-crocheted with premium yarn for maximum comfort and durability.",
    priceInCents: 8999, // $89.99
    category: "cardigans",
    colors: ["Cream", "Sage Green", "Dusty Rose", "Charcoal"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: ["/cream-oversized-crochet-cardigan.jpg", "/cream-cardigan-detail-shot.jpg"],
    gallery: ["/cardigan-flat-lay.jpg", "/cardigan-texture-close-up.jpg", "/cardigan-worn-styling.jpg"],
    stock: 15,
    featured: true,
  },
  {
    id: "summer-crop-top",
    name: "Summer Crop Top",
    description:
      "Lightweight and breathable crop top perfect for summer. Features an intricate stitch pattern that catches the light beautifully.",
    priceInCents: 4999, // $49.99
    category: "tops",
    colors: ["White", "Blush", "Lavender", "Mint"],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: ["/white-crochet-crop-top.jpg", "/crop-top-detail.jpg"],
    gallery: ["/crop-top-flat-lay.jpg", "/crop-top-texture.jpg"],
    stock: 20,
    featured: true,
  },
  {
    id: "beach-cover-up",
    name: "Beach Cover-Up Dress",
    description: "Elegant beach cover-up with flowing silhouette. Perfect for beach days or casual summer outings.",
    priceInCents: 6999, // $69.99
    category: "dresses",
    colors: ["Natural", "Coral", "Ocean Blue", "Sunset Orange"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: ["/crochet-beach-cover-up-dress.jpg", "/beach-dress-detail.jpg"],
    gallery: ["/beach-dress-flat-lay.jpg", "/beach-dress-texture.jpg"],
    stock: 12,
    featured: true,
  },
]
