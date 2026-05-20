export type UserRole = "customer" | "admin"

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
}

export type LoginCredentials = {
  email: string
  password: string
}

export type LoginResponse = {
  user: User
  accessToken: string
  refreshToken: string
}
