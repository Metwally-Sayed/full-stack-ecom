import axios from "axios"
import { env } from "@/config/env"
import { clearAuthSession, getAccessToken } from "@/lib/auth"

export const api = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config) => {
  const token = getAccessToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthSession()

      if (window.location.pathname !== "/login") {
        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  }
)

export const fetcher = async <T>(url: string) => {
  const response = await api.get<T>(url)
  const payload = response.data as { data?: unknown; meta?: unknown }

  if (payload && "data" in payload && !("meta" in payload)) {
    return payload.data as T
  }

  return response.data
}
