import useSWR from "swr"
import type { PaginatedResponse } from "@/types/api"
import type { Product } from "@/types/product"

type ProductParams = {
  search?: string
  category?: string
  status?: "all" | "active" | "inactive"
  page?: number
  limit?: number
}

const defaultMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
}

function productsKey(params: ProductParams) {
  const searchParams = new URLSearchParams()
  searchParams.set("page", String(params.page ?? 1))
  searchParams.set("limit", String(params.limit ?? 10))
  searchParams.set("status", params.status ?? "all")

  if (params.search) {
    searchParams.set("search", params.search)
  }

  if (params.category && params.category !== "all") {
    searchParams.set("category", params.category)
  }

  return `/products?${searchParams.toString()}`
}

export function useProducts(params: ProductParams = {}) {
  const key = productsKey(params)
  const { data, error, isLoading, mutate } = useSWR<
    PaginatedResponse<Product> | Product[]
  >(key)
  const products = Array.isArray(data) ? data : data?.data ?? []
  const meta = Array.isArray(data) ? defaultMeta : data?.meta ?? defaultMeta

  return {
    products,
    meta,
    isLoading,
    isError: Boolean(error),
    mutate,
    key,
  }
}
