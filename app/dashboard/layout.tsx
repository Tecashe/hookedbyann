import type React from "react"
import { checkAdminAccess } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LayoutDashboard, Package, ShoppingCart, LogOut } from "lucide-react"
import { SignOutButton } from "@clerk/nextjs"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await checkAdminAccess()

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Artisan Admin</h1>
          <p className="text-sm text-muted-foreground">Manage your business</p>
        </div>

        <nav className="space-y-2 px-4">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/products">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Package className="h-4 w-4" />
              Products
            </Button>
          </Link>
          <Link href="/dashboard/orders">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <ShoppingCart className="h-4 w-4" />
              Orders
            </Button>
          </Link>
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <SignOutButton>
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </SignOutButton>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
