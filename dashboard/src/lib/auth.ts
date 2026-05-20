import type { User } from "@/types/auth"

const ACCESS_TOKEN_KEY = "accessToken"
const REFRESH_TOKEN_KEY = "refreshToken"
const USER_KEY = "user"

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function saveAuthSession(params: {
  accessToken: string
  refreshToken: string
  user: User
}) {
  localStorage.setItem(ACCESS_TOKEN_KEY, params.accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, params.refreshToken)
  localStorage.setItem(USER_KEY, JSON.stringify(params.user))
}

export function getStoredUser(): User | null {
  const rawUser = localStorage.getItem(USER_KEY)

  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser) as User
  } catch {
    clearAuthSession()
    return null
  }
}

export function setStoredUser(user: User) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuthSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
