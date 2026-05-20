import type { Category } from "@/types/category"

export type Product = {
  id: string
  name: string
  description: string | null
  price: number
  imageUrl: string | null
  isActive: boolean
  category: Category | null
  createdAt: string
}

export type ProductPayload = {
  name: string
  description?: string | null
  price: number
  categoryId: string
  imageUrl?: string | null
  isActive: boolean
}
