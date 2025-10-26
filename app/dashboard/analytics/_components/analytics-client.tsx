"use client"

import { Card } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react"

interface AnalyticsData {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  averageOrderValue: number
  ordersByStatus: {
    pending: number
    processing: number
    shipped: number
    delivered: number
  }
  topProducts: Array<{
    name: string
    sales: number
    revenue: number
  }>
  monthlyData: Array<{
    month: string
    revenue: number
  }>
}

export function AnalyticsClient({ analytics }: { analytics: AnalyticsData }) {
  const statusColors = {
    pending: "#fbbf24",
    processing: "#60a5fa",
    shipped: "#34d399",
    delivered: "#10b981",
  }

  return (
    <main className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Track your business performance and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-3xl font-bold">${analytics.totalRevenue.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-3xl font-bold">{analytics.totalOrders}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Customers</p>
              <p className="text-3xl font-bold">{analytics.totalCustomers}</p>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Order Value</p>
              <p className="text-3xl font-bold">${analytics.averageOrderValue.toFixed(2)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Trend*/}
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => {
                  const numValue = typeof value === 'number' ? value : parseFloat(value as string);
                  return `$${numValue.toFixed(2)}`;
                }} 
              />
              <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Order Status Distribution */}
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Order Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={Object.entries(analytics.ordersByStatus).map(([status, count]) => ({
                  name: status.charAt(0).toUpperCase() + status.slice(1),
                  value: count,
                }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {Object.keys(analytics.ordersByStatus).map((status) => (
                  <Cell key={status} fill={statusColors[status as keyof typeof statusColors]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top Products */}
      <Card className="p-6">
        <h2 className="font-semibold mb-4">Top Products</h2>
        <div className="space-y-4">
          {analytics.topProducts.map((product, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0">
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
              </div>
              <p className="font-semibold">${product.revenue.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </Card>
    </main>
  )
}