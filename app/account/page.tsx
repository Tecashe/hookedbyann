import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronRight, Package, ShoppingBag, Heart, Clock } from "lucide-react"

export default async function AccountPage() {
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

  const wishlistItems = await db.wishlistItem.findMany({
    where: { userId: user.id },
  })

  const stats = {
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, order) => sum + order.totalPrice, 0) / 100,
    wishlistCount: wishlistItems.length,
    pendingOrders: orders.filter((o) => o.status === "pending" || o.status === "processing").length,
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-bold">Welcome back, {user.name}!</h1>
        <p className="text-muted-foreground mt-2">Manage your account and track your orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-3xl font-bold">{stats.totalOrders}</p>
            </div>
            <ShoppingBag className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-3xl font-bold">${stats.totalSpent.toFixed(2)}</p>
            </div>
            <Package className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Orders</p>
              <p className="text-3xl font-bold">{stats.pendingOrders}</p>
            </div>
            <Clock className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Wishlist Items</p>
              <p className="text-3xl font-bold">{stats.wishlistCount}</p>
            </div>
            <Heart className="h-8 w-8 text-primary" />
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/account/orders">View All</Link>
          </Button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No orders yet</p>
            <Button asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <Link key={order.id} href={`/account/orders/${order.id}`}>
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-sm text-muted-foreground">{order.items.length} item(s)</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${(order.totalPrice / 100).toFixed(2)}</p>
                    <span
                      className={`inline-block text-xs font-semibold px-2 py-1 rounded mt-1 ${
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
                  <ChevronRight className="h-5 w-5 text-muted-foreground ml-4" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Button asChild variant="outline" className="h-auto py-6 bg-transparent">
          <Link href="/account/profile">
            <div className="text-center">
              <p className="font-semibold">Edit Profile</p>
              <p className="text-sm text-muted-foreground">Update your information</p>
            </div>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-6 bg-transparent">
          <Link href="/wishlist">
            <div className="text-center">
              <p className="font-semibold">My Wishlist</p>
              <p className="text-sm text-muted-foreground">View saved items</p>
            </div>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-6 bg-transparent">
          <Link href="/products">
            <div className="text-center">
              <p className="font-semibold">Continue Shopping</p>
              <p className="text-sm text-muted-foreground">Browse our collection</p>
            </div>
          </Link>
        </Button>
      </div>
    </div>
  )
}
