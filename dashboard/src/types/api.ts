export type PaginatedResponse<T> = {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type ApiErrorBody = {
  statusCode?: number
  error?: string
  message?: string | string[]
}
