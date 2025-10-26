// import { getAdminStats } from "@/app/actions/admin"
// import { Card } from "@/components/ui/card"
// import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react"

// export default async function DashboardPage() {
//   const stats = await getAdminStats()

//   const totalRevenueInDollars = (stats.totalRevenue / 100).toFixed(2)

//   return (
//     <div>
//       <h1 className="text-3xl font-bold">Dashboard</h1>
//       <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>

//       {/* Stats Grid */}
//       <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
//         <Card className="p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-muted-foreground">Total Orders</p>
//               <p className="mt-2 text-3xl font-bold">{stats.totalOrders}</p>
//             </div>
//             <ShoppingCart className="h-8 w-8 text-muted-foreground" />
//           </div>
//         </Card>

//         <Card className="p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-muted-foreground">Total Revenue</p>
//               <p className="mt-2 text-3xl font-bold">${totalRevenueInDollars}</p>
//             </div>
//             <DollarSign className="h-8 w-8 text-muted-foreground" />
//           </div>
//         </Card>

//         <Card className="p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-muted-foreground">Total Products</p>
//               <p className="mt-2 text-3xl font-bold">{stats.totalProducts}</p>
//             </div>
//             <Package className="h-8 w-8 text-muted-foreground" />
//           </div>
//         </Card>

//         <Card className="p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-muted-foreground">Avg Order Value</p>
//               <p className="mt-2 text-3xl font-bold">
//                 ${stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders / 100).toFixed(2) : "0.00"}
//               </p>
//             </div>
//             <TrendingUp className="h-8 w-8 text-muted-foreground" />
//           </div>
//         </Card>
//       </div>

//       {/* Recent Orders */}
//       <div className="mt-8">
//         <h2 className="text-xl font-bold">Recent Orders</h2>
//         <Card className="mt-4 overflow-hidden">
//           <table className="w-full">
//             <thead className="border-b bg-muted">
//               <tr>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Order ID</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Customer</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {stats.recentOrders.map((order) => (
//                 <tr key={order.id} className="border-b hover:bg-muted/50">
//                   <td className="px-6 py-3 text-sm font-mono">{order.id.slice(0, 8)}</td>
//                   <td className="px-6 py-3 text-sm">{order.user.name || order.email}</td>
//                   <td className="px-6 py-3 text-sm font-semibold">${(order.totalPrice / 100).toFixed(2)}</td>
//                   <td className="px-6 py-3 text-sm">
//                     <span
//                       className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
//                         order.status === "delivered"
//                           ? "bg-green-100 text-green-800"
//                           : order.status === "shipped"
//                             ? "bg-blue-100 text-blue-800"
//                             : "bg-yellow-100 text-yellow-800"
//                       }`}
//                     >
//                       {order.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-3 text-sm text-muted-foreground">
//                     {new Date(order.createdAt).toLocaleDateString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </Card>
//       </div>
//     </div>
//   )
// }

import { getAdminStats } from "@/app/actions/admin"
import { Card } from "@/components/ui/card"
import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
  try {
    const stats = await getAdminStats()

    const totalRevenueInDollars = (stats.totalRevenue / 100).toFixed(2)

    return (
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>

        {/* Stats Grid */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="mt-2 text-3xl font-bold">{stats.totalOrders}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="mt-2 text-3xl font-bold">${totalRevenueInDollars}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="mt-2 text-3xl font-bold">{stats.totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
                <p className="mt-2 text-3xl font-bold">
                  ${stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders / 100).toFixed(2) : "0.00"}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </Card>
        </div>

        {/* Recent Orders */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recent Orders</h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/orders">View All</Link>
            </Button>
          </div>
          <Card className="overflow-hidden">
            <table className="w-full">
              <thead className="border-b bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Order ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Customer</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-muted/50">
                    <td className="px-6 py-3 text-sm font-mono">
                      <Link href={`/dashboard/orders/${order.id}`} className="hover:underline">
                        {order.id.slice(0, 8)}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-sm">{order.user.name || order.email}</td>
                    <td className="px-6 py-3 text-sm font-semibold">${(order.totalPrice / 100).toFixed(2)}</td>
                    <td className="px-6 py-3 text-sm">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
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
                    </td>
                    <td className="px-6 py-3 text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    console.error("[v0] Error loading dashboard:", error)
    return (
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-red-600 mt-4">Failed to load dashboard data. Please try again later.</p>
      </div>
    )
  }
}
