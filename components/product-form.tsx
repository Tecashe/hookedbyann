"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createProduct, updateProduct } from "@/app/actions/admin"
import { Plus, X, Loader2 } from "lucide-react"

interface ProductFormProps {
  product?: {
    id: string
    name: string
    description: string
    price: number
    category: string
    colors: string[]
    sizes: string[]
    images: string[]
    gallery: string[]
    stock: number
  }
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [colors, setColors] = useState<string[]>(product?.colors || [])
  const [sizes, setSizes] = useState<string[]>(product?.sizes || [])
  const [images, setImages] = useState<string[]>(product?.images || [])
  const [gallery, setGallery] = useState<string[]>(product?.gallery || [])
  const [colorInput, setColorInput] = useState("")
  const [sizeInput, setSizeInput] = useState("")
  const [imageInput, setImageInput] = useState("")
  const [galleryInput, setGalleryInput] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const data = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        price: Math.round(Number.parseFloat(formData.get("price") as string) * 100),
        category: formData.get("category") as string,
        colors,
        sizes,
        images,
        gallery,
        stock: Number.parseInt(formData.get("stock") as string),
      }

      if (product) {
        await updateProduct(product.id, data)
      } else {
        await createProduct(data)
      }

      router.push("/dashboard/products")
      router.refresh()
    } catch (error) {
      console.error("Error saving product:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Product Name</label>
            <Input name="name" defaultValue={product?.name} placeholder="e.g., Cozy Oversized Cardigan" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              name="description"
              defaultValue={product?.description}
              placeholder="Describe your product in detail..."
              rows={5}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Price ($)</label>
              <Input
                name="price"
                type="number"
                step="0.01"
                defaultValue={product ? (product.price / 100).toFixed(2) : ""}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Stock</label>
              <Input name="stock" type="number" defaultValue={product?.stock || ""} placeholder="0" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              name="category"
              defaultValue={product?.category || ""}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
              required
            >
              <option value="">Select a category</option>
              <option value="cardigans">Cardigans</option>
              <option value="tops">Tops</option>
              <option value="dresses">Dresses</option>
              <option value="accessories">Accessories</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Colors */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Available Colors</h2>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              placeholder="e.g., Cream, Sage Green"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  if (colorInput.trim()) {
                    setColors([...colors, colorInput.trim()])
                    setColorInput("")
                  }
                }
              }}
            />
            <Button
              type="button"
              onClick={() => {
                if (colorInput.trim()) {
                  setColors([...colors, colorInput.trim()])
                  setColorInput("")
                }
              }}
              variant="outline"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {colors.map((color, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
                <span className="text-sm">{color}</span>
                <button
                  type="button"
                  onClick={() => setColors(colors.filter((_, i) => i !== idx))}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Sizes */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Available Sizes</h2>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              placeholder="e.g., XS, S, M, L, XL"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  if (sizeInput.trim()) {
                    setSizes([...sizes, sizeInput.trim()])
                    setSizeInput("")
                  }
                }
              }}
            />
            <Button
              type="button"
              onClick={() => {
                if (sizeInput.trim()) {
                  setSizes([...sizes, sizeInput.trim()])
                  setSizeInput("")
                }
              }}
              variant="outline"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
                <span className="text-sm font-medium">{size}</span>
                <button
                  type="button"
                  onClick={() => setSizes(sizes.filter((_, i) => i !== idx))}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Images */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Product Images</h2>
        <p className="text-sm text-muted-foreground mb-4">Add main product images (first image is featured)</p>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              placeholder="e.g., /cream-cardigan.jpg"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  if (imageInput.trim()) {
                    setImages([...images, imageInput.trim()])
                    setImageInput("")
                  }
                }
              }}
            />
            <Button
              type="button"
              onClick={() => {
                if (imageInput.trim()) {
                  setImages([...images, imageInput.trim()])
                  setImageInput("")
                }
              }}
              variant="outline"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {images.map((img, idx) => (
              <div key={idx} className="flex items-center justify-between bg-muted p-3 rounded-md">
                <span className="text-sm">{img}</span>
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Gallery */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Gallery Images</h2>
        <p className="text-sm text-muted-foreground mb-4">Add additional gallery images for product showcase</p>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={galleryInput}
              onChange={(e) => setGalleryInput(e.target.value)}
              placeholder="e.g., /cardigan-detail.jpg"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  if (galleryInput.trim()) {
                    setGallery([...gallery, galleryInput.trim()])
                    setGalleryInput("")
                  }
                }
              }}
            />
            <Button
              type="button"
              onClick={() => {
                if (galleryInput.trim()) {
                  setGallery([...gallery, galleryInput.trim()])
                  setGalleryInput("")
                }
              }}
              variant="outline"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {gallery.map((img, idx) => (
              <div key={idx} className="flex items-center justify-between bg-muted p-3 rounded-md">
                <span className="text-sm">{img}</span>
                <button
                  type="button"
                  onClick={() => setGallery(gallery.filter((_, i) => i !== idx))}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading} size="lg">
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {product ? "Update Product" : "Create Product"}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
