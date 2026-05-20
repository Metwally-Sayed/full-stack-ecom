import { Edit, MoreHorizontal, Power, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import { ConfirmDialog } from "@/components/common/confirm-dialog"
import { EmptyState } from "@/components/common/empty-state"
import { PriceText } from "@/components/common/price-text"
import { ProductStatusBadge } from "@/components/products/product-status-badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate } from "@/lib/utils"
import type { Product } from "@/types/product"

type ProductsTableProps = {
  products: Product[]
  isLoading: boolean
  onDelete: (product: Product) => void
  onToggleStatus: (product: Product) => void
}

export function ProductsTable({
  products,
  isLoading,
  onDelete,
  onToggleStatus,
}: ProductsTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 border-b p-4 last:border-0">
            <Skeleton className="size-12 rounded-md" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8" />
          </div>
        ))}
      </div>
    )
  }

  if (!products.length) {
    return (
      <EmptyState
        title="No products found"
        description="Create the first product or adjust the current filters."
        action={
          <Button asChild>
            <Link to="/products/new">Create product</Link>
          </Button>
        }
      />
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="size-12 overflow-hidden rounded-md bg-muted">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="line-clamp-1 max-w-md text-xs text-muted-foreground">
                      {product.description ?? "No description"}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{product.category?.name ?? "Uncategorized"}</TableCell>
              <TableCell>
                <PriceText value={product.price} />
              </TableCell>
              <TableCell>
                <ProductStatusBadge isActive={product.isActive} />
              </TableCell>
              <TableCell>{formatDate(product.createdAt)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <MoreHorizontal className="size-4" />
                      <span className="sr-only">Open product actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/products/${product.id}/edit`}>
                        <Edit className="size-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onToggleStatus(product)}>
                      <Power className="size-4" />
                      {product.isActive ? "Deactivate" : "Activate"}
                    </DropdownMenuItem>
                    <ConfirmDialog
                      title="Delete product"
                      description="This removes the product from the admin catalog."
                      confirmLabel="Delete"
                      onConfirm={() => onDelete(product)}
                    >
                      <DropdownMenuItem
                        className="text-destructive"
                        onSelect={(event) => event.preventDefault()}
                      >
                        <Trash2 className="size-4" />
                        Delete
                      </DropdownMenuItem>
                    </ConfirmDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
