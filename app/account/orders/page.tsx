import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default async function OrdersPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/")
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) {
    redirect("/")
  }

  const orders = await db.order.findMany({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Order History</h1>
        <p className="text-muted-foreground">View and track all your orders</p>
      </div>

      {orders.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No orders yet</p>
          <Button asChild>
            <Link href="/products">Start Shopping</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/account/orders/${order.id}`}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div>
                        <p className="font-semibold text-lg">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Items</p>
                        <p className="font-medium">{order.items.length} product(s)</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total</p>
                        <p className="font-medium">${(order.totalPrice / 100).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <span
                          className={`inline-block text-xs font-semibold px-2 py-1 rounded ${
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
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground ml-4" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

