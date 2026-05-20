/* eslint-disable react-hooks/incompatible-library */
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ProductImageUpload } from "@/components/products/product-image-upload"
import type { Category } from "@/types/category"
import type { Product, ProductPayload } from "@/types/product"

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  price: z.number().positive("Price must be greater than zero"),
  categoryId: z.string().min(1, "Category is required"),
  imageUrl: z.string().url("Image URL must be valid").nullable().or(z.literal("")),
  isActive: z.boolean(),
})

type ProductFormValues = z.infer<typeof productSchema>

type ProductFormProps = {
  product?: Product
  categories: Category[]
  isSubmitting: boolean
  onSubmit: (payload: ProductPayload) => Promise<void>
}

export function ProductForm({
  product,
  categories,
  isSubmitting,
  onSubmit,
}: ProductFormProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    watch,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product?.price ?? 0,
      categoryId: product?.category?.id ?? "",
      imageUrl: product?.imageUrl ?? "",
      isActive: product?.isActive ?? true,
    },
  })

  const imageUrl = watch("imageUrl")

  return (
    <form
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]"
      onSubmit={handleSubmit((values) =>
        onSubmit({
          name: values.name,
          description: values.description?.trim() || null,
          price: Number(values.price),
          categoryId: values.categoryId,
          imageUrl: values.imageUrl || null,
          isActive: values.isActive,
        })
      )}
    >
      <Card>
        <CardHeader>
          <CardTitle>Product information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name ? (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={6} {...register("description")} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price ? (
                <p className="text-xs text-destructive">{errors.price.message}</p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label>Category</Label>
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoryId ? (
                <p className="text-xs text-destructive">
                  {errors.categoryId.message}
                </p>
              ) : null}
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="isActive">Active product</Label>
              <p className="text-sm text-muted-foreground">
                Active products can appear in the customer storefront.
              </p>
            </div>
            <Controller
              control={control}
              name="isActive"
              render={({ field }) => (
                <Switch
                  id="isActive"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-6 self-start">
        <Card>
          <CardHeader>
            <CardTitle>Product image</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductImageUpload
              value={imageUrl || null}
              onChange={(url) => setValue("imageUrl", url ?? "", { shouldDirty: true })}
            />
            {errors.imageUrl ? (
              <p className="mt-2 text-xs text-destructive">
                {errors.imageUrl.message}
              </p>
            ) : null}
          </CardContent>
        </Card>
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Saving product..." : "Save product"}
        </Button>
      </div>
    </form>
  )
}
