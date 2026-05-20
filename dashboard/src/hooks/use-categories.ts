import useSWR from "swr"
import type { Category } from "@/types/category"
import type { PaginatedResponse } from "@/types/api"

export function useCategories() {
  const { data, error, isLoading, mutate } = useSWR<
    PaginatedResponse<Category> | Category[]
  >("/categories")
  const categories = Array.isArray(data) ? data : data?.data ?? []

  return {
    categories,
    isLoading,
    isError: Boolean(error),
    mutate,
  }
}
