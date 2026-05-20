/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import {
  clearAuthSession,
  getAccessToken,
  getStoredUser,
  saveAuthSession,
  setStoredUser,
} from "@/lib/auth"
import { getErrorMessage } from "@/lib/utils"
import { getCurrentUser, loginRequest } from "@/services/auth.service"
import type { LoginCredentials, User } from "@/types/auth"

type AuthContextValue = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: PropsWithChildren) {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(() => getStoredUser())
  const [isLoading, setIsLoading] = useState(() => Boolean(getAccessToken()))

  const logout = useCallback(() => {
    clearAuthSession()
    setUser(null)
    navigate("/login", { replace: true })
  }, [navigate])

  const refreshUser = useCallback(async () => {
    const token = getAccessToken()

    if (!token) {
      setIsLoading(false)
      return
    }

    try {
      const currentUser = await getCurrentUser()

      if (currentUser.role !== "admin") {
        toast.error("Only admin accounts can access the dashboard")
        logout()
        return
      }

      setStoredUser(currentUser)
      setUser(currentUser)
    } catch (error) {
      toast.error(getErrorMessage(error))
      logout()
    } finally {
      setIsLoading(false)
    }
  }, [logout])

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const response = await loginRequest(credentials)

      if (response.user.role !== "admin") {
        clearAuthSession()
        throw new Error("Only admin accounts can access the dashboard")
      }

      saveAuthSession(response)
      setUser(response.user)
      toast.success("Welcome back")
      navigate("/dashboard", { replace: true })
    },
    [navigate]
  )

  useEffect(() => {
    // Auth hydration synchronizes localStorage with the backend session on app load.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshUser()
  }, [refreshUser])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user && getAccessToken()),
      isLoading,
      login,
      logout,
      refreshUser,
    }),
    [isLoading, login, logout, refreshUser, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }

  return context
}
