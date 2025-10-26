import { CouponForm } from "@/components/coupon-form"

export default function NewCouponPage() {
  return (
    <main className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Create Coupon</h1>
        <p className="text-muted-foreground">Create a new discount code</p>
      </div>

      <CouponForm />
    </main>
  )
}
