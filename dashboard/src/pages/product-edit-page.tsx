import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import useSWR, { mutate } from "swr"
import { toast } from "sonner"
import { ErrorState } from "@/components/common/error-state"
import { PageHeader } from "@/components/layout/page-header"
import { ProductForm } from "@/components/products/product-form"
import { Skeleton } from "@/components/ui/skeleton"
import { useCategories } from "@/hooks/use-categories"
import { getErrorMessage } from "@/lib/utils"
import { updateProduct } from "@/services/products.service"
import type { Product, ProductPayload } from "@/types/product"

export function ProductEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const categoriesState = useCategories()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    data: product,
    error,
    isLoading,
    mutate: mutateProduct,
  } = useSWR<Product>(id ? `/products/${id}` : null)

  async function handleSubmit(payload: ProductPayload) {
    if (!id) {
      return
    }

    setIsSubmitting(true)

    try {
      await updateProduct(id, payload)
      toast.success("Product updated")
      await mutateProduct()
      await mutate((key) => typeof key === "string" && key.startsWith("/products"))
      navigate("/products")
    } catch (submitError) {
      toast.error(getErrorMessage(submitError))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (error || categoriesState.isError) {
    return <ErrorState onRetry={() => void mutateProduct()} />
  }

  return (
    <>
      <PageHeader
        title="Edit product"
        description="Update product details and storefront availability."
      />
      {isLoading || !product ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Skeleton className="h-96 rounded-lg" />
          <Skeleton className="h-80 rounded-lg" />
        </div>
      ) : (
        <ProductForm
          product={product}
          categories={categoriesState.categories}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      )}
    </>
  )
}
