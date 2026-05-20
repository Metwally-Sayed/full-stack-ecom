import useSWR from "swr"
import type { PaginatedResponse } from "@/types/api"
import type { Order } from "@/types/order"

type OrderParams = {
  status?: string
  page?: number
  limit?: number
}

const defaultMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
}

function ordersKey(params: OrderParams) {
  const searchParams = new URLSearchParams()
  searchParams.set("page", String(params.page ?? 1))
  searchParams.set("limit", String(params.limit ?? 10))

  if (params.status && params.status !== "all") {
    searchParams.set("status", params.status)
  }

  return `/orders?${searchParams.toString()}`
}

export function useOrders(params: OrderParams = {}) {
  const key = ordersKey(params)
  const { data, error, isLoading, mutate } = useSWR<
    PaginatedResponse<Order> | Order[]
  >(key)
  const orders = Array.isArray(data) ? data : data?.data ?? []
  const meta = Array.isArray(data) ? defaultMeta : data?.meta ?? defaultMeta

  return {
    orders,
    meta,
    isLoading,
    isError: Boolean(error),
    mutate,
    key,
  }
}
