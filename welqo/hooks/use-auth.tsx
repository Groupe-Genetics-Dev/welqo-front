
"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { apiClient } from "@/lib/api"

interface User {
  name: string
  phone_number: string
  appartement: string
}

interface AuthContextType {
  user: User | null
  login: (phone_number: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement
    const token = localStorage.getItem("access_token")
    const userName = localStorage.getItem("user_name")

    if (token && userName) {
      // Ici, vous pourriez faire un appel API pour récupérer les infos complètes de l'utilisateur
      setUser({
        name: userName,
        phone_number: "", // À récupérer via API
        appartement: "", // À récupérer via API
      })
    }

    setIsLoading(false)
  }, [])

  const login = async (phone_number: string, password: string) => {
    const response = await apiClient.login(phone_number, password)

    if (response.error) {
      return { success: false, error: response.error }
    }

    setUser({
      name: response.data.user_name,
      phone_number,
      appartement: "", // À récupérer via API si nécessaire
    })

    // Redirection automatique après connexion réussie
    setTimeout(() => {
      window.location.href = "/residents/dashboard"
    }, 100)

    return { success: true }
  }

  const logout = () => {
    apiClient.removeToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
