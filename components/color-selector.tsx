"use client"

interface ColorSelectorProps {
  colors: string[]
  selectedColor: string
  onColorChange: (color: string) => void
}

const colorMap: Record<string, string> = {
  Cream: "#FFF8F0",
  "Sage Green": "#9CAF88",
  "Dusty Rose": "#D4A5A5",
  Charcoal: "#36454F",
  White: "#FFFFFF",
  Blush: "#FFB3BA",
  Lavender: "#E6D5E8",
  Mint: "#B8E6D5",
  Natural: "#D4C5B9",
  Coral: "#FF7F50",
  "Ocean Blue": "#4A90E2",
  "Sunset Orange": "#FF6B35",
}

export function ColorSelector({ colors, selectedColor, onColorChange }: ColorSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Color</h3>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onColorChange(color)}
            className={`relative h-10 w-10 rounded-full border-2 transition-all ${
              selectedColor === color
                ? "border-primary ring-2 ring-primary ring-offset-2"
                : "border-muted-foreground hover:border-primary"
            }`}
            style={{ backgroundColor: colorMap[color] || "#E5E7EB" }}
            title={color}
            aria-label={`Select ${color}`}
          >
            {selectedColor === color && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full">
                <div className="h-2 w-2 rounded-full bg-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
