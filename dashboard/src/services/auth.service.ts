import { api } from "@/lib/api"
import type { LoginCredentials, LoginResponse, User } from "@/types/auth"

export async function loginRequest(credentials: LoginCredentials) {
  const response = await api.post<{ data: LoginResponse }>("/auth/login", credentials)
  return response.data.data
}

export async function getCurrentUser() {
  const response = await api.get<{ data: User }>("/auth/me")
  return response.data.data
}
