// import { getOrders } from "@/app/actions/admin"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import Link from "next/link"
// import { ChevronRight } from "lucide-react"

// export default async function OrdersPage() {
//   const orders = await getOrders()

//   return (
//     <div>
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold">Orders</h1>
//         <p className="text-muted-foreground">Manage and track customer orders</p>
//       </div>

//       {orders.length === 0 ? (
//         <Card className="p-12 text-center">
//           <p className="text-muted-foreground">No orders yet</p>
//         </Card>
//       ) : (
//         <Card className="overflow-hidden">
//           <table className="w-full">
//             <thead className="border-b bg-muted">
//               <tr>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Order ID</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Customer</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Items</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Total</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order) => (
//                 <tr key={order.id} className="border-b hover:bg-muted/50 transition-colors">
//                   <td className="px-6 py-3 text-sm font-mono text-muted-foreground">{order.id.slice(0, 8)}</td>
//                   <td className="px-6 py-3 text-sm">
//                     <div>
//                       <p className="font-medium">{order.user?.name || "Guest"}</p>
//                       <p className="text-xs text-muted-foreground">{order.email}</p>
//                     </div>
//                   </td>
//                   <td className="px-6 py-3 text-sm">{order.items.length} item(s)</td>
//                   <td className="px-6 py-3 text-sm font-semibold">${(order.totalPrice / 100).toFixed(2)}</td>
//                   <td className="px-6 py-3 text-sm">
//                     <span
//                       className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
//                         order.status === "delivered"
//                           ? "bg-green-100 text-green-800"
//                           : order.status === "shipped"
//                             ? "bg-blue-100 text-blue-800"
//                             : order.status === "processing"
//                               ? "bg-purple-100 text-purple-800"
//                               : "bg-yellow-100 text-yellow-800"
//                       }`}
//                     >
//                       {order.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-3 text-sm text-muted-foreground">
//                     {new Date(order.createdAt).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-3 text-sm">
//                     <Button asChild variant="ghost" size="sm">
//                       <Link href={`/dashboard/orders/${order.id}`}>
//                         <ChevronRight className="h-4 w-4" />
//                       </Link>
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </Card>
//       )}
//     </div>
//   )
// }

import { getOrders } from "@/app/actions/admin"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default async function OrdersPage() {
  try {
    const orders = await getOrders()

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage all customer orders</p>
        </div>

        {orders.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No orders yet</p>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <table className="w-full">
              <thead className="border-b bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Order ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Customer</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Items</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-muted/50">
                    <td className="px-6 py-3 text-sm font-mono">{order.id.slice(0, 8)}</td>
                    <td className="px-6 py-3 text-sm">{order.user.name || order.email}</td>
                    <td className="px-6 py-3 text-sm">{order.items.length} item(s)</td>
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
                    <td className="px-6 py-3 text-sm">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/dashboard/orders/${order.id}`}>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    )
  } catch (error) {
    console.error("[v0] Error loading orders:", error)
    return (
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-red-600 mt-4">Failed to load orders. Please try again later.</p>
      </div>
    )
  }
}
