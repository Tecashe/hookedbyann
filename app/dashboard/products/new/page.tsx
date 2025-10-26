import { ProductForm } from "@/components/product-form"
import { checkAdminAccess } from "@/app/actions/admin"

export default async function NewProductPage() {
  await checkAdminAccess()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <p className="text-muted-foreground">Create a new product for your store</p>
      </div>
      <ProductForm />
    </div>
  )
}
