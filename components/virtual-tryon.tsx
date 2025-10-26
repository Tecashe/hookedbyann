"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Upload, RotateCcw } from "lucide-react"

interface VirtualTryonProps {
  productImage: string
  productName: string
  colors: string[]
}

export function VirtualTryon({ productImage, productName, colors }: VirtualTryonProps) {
  const [userPhoto, setUserPhoto] = useState<string | null>(null)
  const [scale, setScale] = useState(100)
  const [positionX, setPositionX] = useState(0)
  const [positionY, setPositionY] = useState(0)
  const [selectedColor, setSelectedColor] = useState(colors[0])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setUserPhoto(event.target?.result as string)
        setScale(100)
        setPositionX(0)
        setPositionY(0)
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    if (!userPhoto || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const userImg = new window.Image()
    userImg.crossOrigin = "anonymous"
    userImg.onload = () => {
      // Set canvas size to match user image
      canvas.width = userImg.width
      canvas.height = userImg.height

      // Draw user photo
      ctx.drawImage(userImg, 0, 0)

      // Draw product image with adjustments
      const productImg = new window.Image()
      productImg.crossOrigin = "anonymous"
      productImg.src = productImage

      productImg.onload = () => {
        const scaledWidth = (productImg.width * scale) / 100
        const scaledHeight = (productImg.height * scale) / 100

        // Apply color filter if not the default
        if (selectedColor !== colors[0]) {
          ctx.globalAlpha = 0.8
        }

        ctx.drawImage(productImg, positionX, positionY, scaledWidth, scaledHeight)
        ctx.globalAlpha = 1
      }
    }
    userImg.src = userPhoto
  }, [userPhoto, scale, positionX, positionY, productImage, selectedColor, colors])

  const downloadImage = () => {
    if (!canvasRef.current) return
    const link = document.createElement("a")
    link.href = canvasRef.current.toDataURL()
    link.download = `${productName}-tryon.png`
    link.click()
  }

  const reset = () => {
    setUserPhoto(null)
    setScale(100)
    setPositionX(0)
    setPositionY(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Section */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Upload Your Photo</h3>

          {!userPhoto ? (
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="font-semibold">Click to upload</p>
              <p className="text-sm text-muted-foreground">or drag and drop</p>
              <p className="text-xs text-muted-foreground mt-2">PNG, JPG up to 10MB</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Photo uploaded successfully!</p>
              <Button onClick={reset} variant="outline" className="w-full bg-transparent">
                <RotateCcw className="h-4 w-4 mr-2" />
                Upload Different Photo
              </Button>
            </div>
          )}

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
        </Card>

        {/* Controls Section */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Adjust Fit</h3>

          {userPhoto && (
            <div className="space-y-6">
              {/* Scale */}
              <div>
                <label className="text-sm font-semibold block mb-2">Size: {scale}%</label>
                <Slider
                  value={[scale]}
                  onValueChange={(value) => setScale(value[0])}
                  min={50}
                  max={200}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* Position X */}
              <div>
                <label className="text-sm font-semibold block mb-2">Horizontal Position</label>
                <Slider
                  value={[positionX]}
                  onValueChange={(value) => setPositionX(value[0])}
                  min={-200}
                  max={200}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* Position Y */}
              <div>
                <label className="text-sm font-semibold block mb-2">Vertical Position</label>
                <Slider
                  value={[positionY]}
                  onValueChange={(value) => setPositionY(value[0])}
                  min={-200}
                  max={200}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* Color Selection */}
              <div>
                <label className="text-sm font-semibold block mb-2">Color</label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${
                        selectedColor === color
                          ? "ring-2 ring-primary ring-offset-2 bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted-foreground/20"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={downloadImage} className="w-full">
                Download Try-On Photo
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Preview */}
      {userPhoto && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Preview</h3>
          <div className="flex justify-center bg-muted rounded-lg p-4 overflow-auto max-h-96">
            <canvas ref={canvasRef} className="max-w-full h-auto" style={{ maxHeight: "400px", width: "auto" }} />
          </div>
        </Card>
      )}
    </div>
  )
}
