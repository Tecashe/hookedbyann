import { db } from "@/lib/db"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Trash2, Edit } from "lucide-react"
import { deleteCoupon } from "@/app/actions/coupons"

async function getCoupons() {
  return await db.coupon.findMany({
    orderBy: { createdAt: "desc" },
  })
}

export default async function CouponsPage() {
  const coupons = await getCoupons()

  return (
    <main className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Discount Codes</h1>
          <p className="text-muted-foreground">Create and manage promotional codes</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/coupons/new">Create Coupon</Link>
        </Button>
      </div>

      {coupons.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No coupons yet </p>
          <Button asChild>
            <Link href="/dashboard/coupons/new">Create Your First Coupon</Link>
          </Button>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Code</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Discount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Uses</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Expires</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="border-b hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <p className="font-mono font-semibold">{coupon.code}</p>
                    </td>
                    <td className="px-6 py-4">
                      {coupon.type === "percentage" ? `${coupon.discount}%` : `$${(coupon.discount / 100).toFixed(2)}`}
                    </td>
                    <td className="px-6 py-4">
                      {coupon.maxUses ? `${coupon.usedCount}/${coupon.maxUses}` : `${coupon.usedCount} (unlimited)`}
                    </td>
                    <td className="px-6 py-4">
                      {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "Never"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          coupon.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {coupon.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/dashboard/coupons/${coupon.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        {/* <form action={deleteCoupon}>
                          <input type="hidden" name="id" value={coupon.id} />
                          <Button variant="destructive" size="sm" type="submit">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </main>
  )
}
