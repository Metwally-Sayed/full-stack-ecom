import { api } from "@/lib/api"
import type { ProductPayload } from "@/types/product"

export async function createProduct(data: ProductPayload) {
  const response = await api.post("/products", data)
  return response.data
}

export async function updateProduct(id: string, data: ProductPayload) {
  const response = await api.patch(`/products/${id}`, data)
  return response.data
}

export async function deleteProduct(id: string) {
  const response = await api.delete(`/products/${id}`)
  return response.data
}

export async function toggleProductStatus(id: string, isActive: boolean) {
  const response = await api.patch(`/products/${id}`, { isActive })
  return response.data
}
