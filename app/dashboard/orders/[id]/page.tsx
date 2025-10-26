import { prisma } from "@/lib/db"
import { checkAdminAccess } from "@/app/actions/admin"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { UpdateOrderStatusButton } from "@/components/update-order-status-button"
import { notFound } from "next/navigation"

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  await checkAdminAccess()

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      user: true,
    },
  })

  if (!order) {
    notFound()
  }

  const statusFlow = ["pending", "processing", "shipped", "delivered"]
  const currentStatusIndex = statusFlow.indexOf(order.status)

  return (
    <div>
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/dashboard/orders">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Link>
      </Button>

      <div className="grid gap-6">
        {/* Order Header */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">Order {order.id.slice(0, 8)}</h1>
              <p className="text-muted-foreground mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <span
              className={`inline-block rounded-full px-4 py-2 text-sm font-semibold ${
                order.status === "delivered"
                  ? "bg-green-100 text-green-800"
                  : order.status === "shipped"
                    ? "bg-blue-100 text-blue-800"
                    : order.status === "processing"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start pb-4 border-b last:border-0">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      {item.color && <p className="text-sm text-muted-foreground">Color: {item.color}</p>}
                      {item.size && <p className="text-sm text-muted-foreground">Size: {item.size}</p>}
                    </div>
                    <p className="font-semibold">${(item.price / 100).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Status Timeline */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Order Status</h2>
              <div className="space-y-4">
                {statusFlow.map((status, index) => (
                  <div key={status} className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        index <= currentStatusIndex
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium capitalize">{status}</p>
                      {index === currentStatusIndex && <p className="text-sm text-muted-foreground">Current status</p>}
                    </div>
                    {index < statusFlow.length - 1 && (
                      <div className={`w-0.5 h-8 ${index < currentStatusIndex ? "bg-primary" : "bg-muted"}`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Update Status */}
              {currentStatusIndex < statusFlow.length - 1 && (
                <div className="mt-6 pt-6 border-t">
                  <UpdateOrderStatusButton
                    orderId={order.id}
                    currentStatus={order.status}
                    nextStatus={statusFlow[currentStatusIndex + 1]}
                  />
                </div>
              )}
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="font-medium">{order.user?.name || "Guest"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{order.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{order.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Shipping Address</p>
                  <p className="font-medium">{order.shippingAddress}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Order Total</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${(order.totalPrice / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${(order.totalPrice / 100).toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
