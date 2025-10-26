import { db } from "@/lib/db"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react"

async function getInventory() {
  const products = await db.product.findMany({
    orderBy: { name: "asc" },
  })

  return products.map((product) => ({
    ...product,
    status: product.stock === 0 ? "out-of-stock" : product.stock < 5 ? "low-stock" : "in-stock",
  }))
}

export default async function InventoryPage() {
  const products = await getInventory()

  const stats = {
    total: products.length,
    inStock: products.filter((p) => p.status === "in-stock").length,
    lowStock: products.filter((p) => p.status === "low-stock").length,
    outOfStock: products.filter((p) => p.status === "out-of-stock").length,
  }

  return (
    <main className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <p className="text-muted-foreground">Track and manage your product stock levels</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Products</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </Card>
        <Card className="p-6 border-green-200 bg-green-50">
          <p className="text-sm text-green-700">In Stock</p>
          <p className="text-3xl font-bold text-green-700">{stats.inStock}</p>
        </Card>
        <Card className="p-6 border-yellow-200 bg-yellow-50">
          <p className="text-sm text-yellow-700">Low Stock</p>
          <p className="text-3xl font-bold text-yellow-700">{stats.lowStock}</p>
        </Card>
        <Card className="p-6 border-red-200 bg-red-50">
          <p className="text-sm text-red-700">Out of Stock</p>
          <p className="text-3xl font-bold text-red-700">{stats.outOfStock}</p>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Product</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Stock Level</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-muted/50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold">{product.stock} units</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {product.status === "in-stock" && (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-sm text-green-600">In Stock</span>
                        </>
                      )}
                      {product.status === "low-stock" && (
                        <>
                          <AlertTriangle className="h-5 w-5 text-yellow-600" />
                          <span className="text-sm text-yellow-600">Low Stock</span>
                        </>
                      )}
                      {product.status === "out-of-stock" && (
                        <>
                          <AlertCircle className="h-5 w-5 text-red-600" />
                          <span className="text-sm text-red-600">Out of Stock</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">${(product.price / 100).toFixed(2)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/dashboard/products/${product.id}`}>Edit</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Low Stock Alert */}
      {stats.lowStock > 0 && (
        <Card className="border-yellow-200 bg-yellow-50 p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-yellow-900">Low Stock Alert</h3>
              <p className="text-sm text-yellow-800 mt-1">
                You have {stats.lowStock} product(s) with low stock levels  (less than 5 units). Consider restocking
                these items.
              </p>
            </div>
          </div>
        </Card>
      )}
    </main>
  )
}
