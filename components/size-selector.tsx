"use client"

import { Button } from "@/components/ui/button"

interface SizeSelectorProps {
  sizes: string[]
  selectedSize: string
  onSizeChange: (size: string) => void
}

export function SizeSelector({ sizes, selectedSize, onSizeChange }: SizeSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Size</h3>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <Button
            key={size}
            onClick={() => onSizeChange(size)}
            variant={selectedSize === size ? "default" : "outline"}
            className="w-12"
          >
            {size}
          </Button>
        ))}
      </div>
    </div>
  )
}
