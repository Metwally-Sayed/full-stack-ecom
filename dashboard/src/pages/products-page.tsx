import { Plus } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { ErrorState } from "@/components/common/error-state"
import { PaginationControls } from "@/components/common/pagination-controls"
import { PageHeader } from "@/components/layout/page-header"
import { ProductsTable } from "@/components/products/products-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCategories } from "@/hooks/use-categories"
import { useProducts } from "@/hooks/use-products"
import { getErrorMessage } from "@/lib/utils"
import { deleteProduct, toggleProductStatus } from "@/services/products.service"
import type { Product } from "@/types/product"

export function ProductsPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all")
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const productsState = useProducts({ search, category, status, page, limit })
  const categoriesState = useCategories()

  async function handleDelete(product: Product) {
    try {
      await deleteProduct(product.id)
      toast.success("Product deleted")
      void productsState.mutate()
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  async function handleToggleStatus(product: Product) {
    try {
      await toggleProductStatus(product.id, !product.isActive)
      toast.success(product.isActive ? "Product deactivated" : "Product activated")
      void productsState.mutate()
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  if (productsState.isError) {
    return <ErrorState onRetry={() => void productsState.mutate()} />
  }

  return (
    <>
      <PageHeader
        title="Products"
        description="Create, edit, and manage storefront availability."
        action={
          <Button asChild>
            <Link to="/products/new">
              <Plus className="size-4" />
              Create product
            </Link>
          </Button>
        }
      />
      <div className="grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-[minmax(0,1fr)_220px_180px]">
        <Input
          placeholder="Search products"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
            setPage(1)
          }}
        />
        <Select
          value={category}
          onValueChange={(value) => {
            setCategory(value)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categoriesState.categories.map((item) => (
              <SelectItem key={item.id} value={item.slug}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={status}
          onValueChange={(value: "all" | "active" | "inactive") => {
            setStatus(value)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ProductsTable
        products={productsState.products}
        isLoading={productsState.isLoading}
        onDelete={(product) => void handleDelete(product)}
        onToggleStatus={(product) => void handleToggleStatus(product)}
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PaginationControls
          page={productsState.meta.page}
          totalPages={productsState.meta.totalPages}
          totalItems={productsState.meta.total}
          onPageChange={setPage}
          isLoading={productsState.isLoading}
        />
        <div className="w-full sm:w-40">
          <Select
            value={String(limit)}
            onValueChange={(value) => {
              setLimit(Number(value))
              setPage(1)
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 / page</SelectItem>
              <SelectItem value="20">20 / page</SelectItem>
              <SelectItem value="50">50 / page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )
}
