import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { mutate } from "swr"
import { toast } from "sonner"
import { ErrorState } from "@/components/common/error-state"
import { PageHeader } from "@/components/layout/page-header"
import { ProductForm } from "@/components/products/product-form"
import { useCategories } from "@/hooks/use-categories"
import { getErrorMessage } from "@/lib/utils"
import { createProduct } from "@/services/products.service"
import type { ProductPayload } from "@/types/product"

export function ProductCreatePage() {
  const navigate = useNavigate()
  const categoriesState = useCategories()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(payload: ProductPayload) {
    setIsSubmitting(true)

    try {
      await createProduct(payload)
      toast.success("Product created")
      await mutate((key) => typeof key === "string" && key.startsWith("/products"))
      navigate("/products")
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (categoriesState.isError) {
    return <ErrorState onRetry={() => void categoriesState.mutate()} />
  }

  return (
    <>
      <PageHeader
        title="Create product"
        description="Add a product with pricing, category, availability, and image."
      />
      <ProductForm
        categories={categoriesState.categories}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </>
  )
}
