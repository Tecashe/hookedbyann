// import { db } from "@/lib/db"
// import { Card } from "@/components/ui/card"
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts"
// import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react"

// async function getAnalytics() {
//   const orders = await db.order.findMany({
//     include: {
//       items: true,
//       user: true,
//     },
//   })

//   const products = await db.product.findMany()
//   const users = await db.user.findMany()

//   // Calculate metrics
//   const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0)
//   const totalOrders = orders.length
//   const totalCustomers = users.filter((u) => u.role === "customer").length
//   const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

//   // Orders by status
//   const ordersByStatus = {
//     pending: orders.filter((o) => o.status === "pending").length,
//     processing: orders.filter((o) => o.status === "processing").length,
//     shipped: orders.filter((o) => o.status === "shipped").length,
//     delivered: orders.filter((o) => o.status === "delivered").length,
//   }

//   // Top product
//   const productSales: Record<string, { name: string; sales: number; revenue: number }> = {}
//   orders.forEach((order) => {
//     order.items.forEach((item) => {
//       if (!productSales[item.productId]) {
//         const product = products.find((p) => p.id === item.productId)
//         productSales[item.productId] = {
//           name: product?.name || "Unknown",
//           sales: 0,
//           revenue: 0,
//         }
//       }
//       productSales[item.productId].sales += item.quantity
//       productSales[item.productId].revenue += item.price * item.quantity
//     })
//   })

//   const topProducts = Object.values(productSales)
//     .sort((a, b) => b.revenue - a.revenue)
//     .slice(0, 5)

//   // Revenue by month
//   const revenueByMonth: Record<string, number> = {}
//   orders.forEach((order) => {
//     const month = new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
//     revenueByMonth[month] = (revenueByMonth[month] || 0) + order.totalPrice
//   })

//   const monthlyData = Object.entries(revenueByMonth).map(([month, revenue]) => ({
//     month,
//     revenue: revenue / 100,
//   }))

//   return {
//     totalRevenue: totalRevenue / 100,
//     totalOrders,
//     totalCustomers,
//     averageOrderValue: averageOrderValue / 100,
//     ordersByStatus,
//     topProducts: topProducts.map((p) => ({
//       ...p,
//       revenue: p.revenue / 100,
//     })),
//     monthlyData,
//   }
// }

// export default async function AnalyticsPage() {
//   const analytics = await getAnalytics()

//   const statusColors = {
//     pending: "#fbbf24",
//     processing: "#60a5fa",
//     shipped: "#34d399",
//     delivered: "#10b981",
//   }

//   return (
//     <main className="space-y-8">
//       <div>
//         <h1 className="text-3xl font-bold">Analytics</h1>
//         <p className="text-muted-foreground">Track your business performance and insights</p>
//       </div>

//       {/* Key Metrics */}
//       <div className="grid gap-4 md:grid-cols-4">
//         <Card className="p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-muted-foreground">Total Revenue</p>
//               <p className="text-3xl font-bold">${analytics.totalRevenue.toFixed(2)}</p>
//             </div>
//             <DollarSign className="h-8 w-8 text-primary" />
//           </div>
//         </Card>

//         <Card className="p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-muted-foreground">Total Orders</p>
//               <p className="text-3xl font-bold">{analytics.totalOrders}</p>
//             </div>
//             <ShoppingCart className="h-8 w-8 text-primary" />
//           </div>
//         </Card>

//         <Card className="p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-muted-foreground">Total Customers</p>
//               <p className="text-3xl font-bold">{analytics.totalCustomers}</p>
//             </div>
//             <Users className="h-8 w-8 text-primary" />
//           </div>
//         </Card>

//         <Card className="p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-muted-foreground">Avg Order Value</p>
//               <p className="text-3xl font-bold">${analytics.averageOrderValue.toFixed(2)}</p>
//             </div>
//             <TrendingUp className="h-8 w-8 text-primary" />
//           </div>
//         </Card>
//       </div>

//       {/* Charts */}
//       <div className="grid gap-6 lg:grid-cols-2">
//         {/* Revenue Trend*/}
//         <Card className="p-6">
//           <h2 className="font-semibold mb-4">Revenue Trend</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={analytics.monthlyData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip 
//                   formatter={(value) => {
//                     const numValue = typeof value === 'number' ? value : parseFloat(value as string);
//                     return `$${numValue.toFixed(2)}`;
//                   }} 
//                 />
//               <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} />
//             </LineChart>
//           </ResponsiveContainer>
//         </Card>

//         {/* Order Status Distribution */}
//         <Card className="p-6">
//           <h2 className="font-semibold mb-4">Order Status Distribution</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={Object.entries(analytics.ordersByStatus).map(([status, count]) => ({
//                   name: status.charAt(0).toUpperCase() + status.slice(1),
//                   value: count,
//                 }))}
//                 cx="50%"
//                 cy="50%"
//                 labelLine={false}
//                 label={({ name, value }) => `${name}: ${value}`}
//                 outerRadius={80}
//                 fill="#8884d8"
//                 dataKey="value"
//               >
//                 {Object.keys(analytics.ordersByStatus).map((status) => (
//                   <Cell key={status} fill={statusColors[status as keyof typeof statusColors]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </Card>
//       </div>

//       {/* Top Products */}
//       <Card className="p-6">
//         <h2 className="font-semibold mb-4">Top Products</h2>
//         <div className="space-y-4">
//           {analytics.topProducts.map((product, index) => (
//             <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0">
//               <div>
//                 <p className="font-medium">{product.name}</p>
//                 <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
//               </div>
//               <p className="font-semibold">${product.revenue.toFixed(2)}</p>
//             </div>
//           ))}
//         </div>
//       </Card>
//     </main>
//   )
// }

import { db } from "@/lib/db"
import { AnalyticsClient } from "./_components/analytics-client"

async function getAnalytics() {
  const orders = await db.order.findMany({
    include: {
      items: true,
      user: true,
    },
  })

  const products = await db.product.findMany()
  const users = await db.user.findMany()

  // Calculate metrics
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0)
  const totalOrders = orders.length
  const totalCustomers = users.filter((u) => u.role === "customer").length
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  // Orders by status
  const ordersByStatus = {
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  }

  // Top product
  const productSales: Record<string, { name: string; sales: number; revenue: number }> = {}
  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!productSales[item.productId]) {
        const product = products.find((p) => p.id === item.productId)
        productSales[item.productId] = {
          name: product?.name || "Unknown",
          sales: 0,
          revenue: 0,
        }
      }
      productSales[item.productId].sales += item.quantity
      productSales[item.productId].revenue += item.price * item.quantity
    })
  })

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  // Revenue by month
  const revenueByMonth: Record<string, number> = {}
  orders.forEach((order) => {
    const month = new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    revenueByMonth[month] = (revenueByMonth[month] || 0) + order.totalPrice
  })

  const monthlyData = Object.entries(revenueByMonth).map(([month, revenue]) => ({
    month,
    revenue: revenue / 100,
  }))

  return {
    totalRevenue: totalRevenue / 100,
    totalOrders,
    totalCustomers,
    averageOrderValue: averageOrderValue / 100,
    ordersByStatus,
    topProducts: topProducts.map((p) => ({
      ...p,
      revenue: p.revenue / 100,
    })),
    monthlyData,
  }
}

export default async function AnalyticsPage() {
  const analytics = await getAnalytics()

  return <AnalyticsClient analytics={analytics} />
}