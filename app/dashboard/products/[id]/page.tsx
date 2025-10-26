import { ProductForm } from "@/components/product-form"
import { checkAdminAccess } from "@/app/actions/admin"
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"

export default async function EditProductPage({ params }: { params: { id: string } }) {
  await checkAdminAccess()

  const product = await prisma.product.findUnique({
    where: { id: params.id },
  })

  if (!product) {
    notFound()
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground">Update product details</p>
      </div>
      <ProductForm product={product} />
    </div>
  )
}
