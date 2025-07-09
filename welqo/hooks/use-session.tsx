"use client"

import { useState, useEffect } from "react"

interface UserSession {
  id: string
  email?: string
  name?: string
  role?: "resident" | "gardien" | "gestionnaire"
  lastActivity: number
}

export function useSession() {
  const [session, setSession] = useState<UserSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Charger la session depuis le localStorage
    const savedSession = localStorage.getItem("user-session")
    if (savedSession) {
      const parsedSession: UserSession = JSON.parse(savedSession)

      // Vérifier si la session n'a pas expiré (24h)
      const now = Date.now()
      const sessionAge = now - parsedSession.lastActivity
      const maxAge = 24 * 60 * 60 * 1000 // 24 heures

      if (sessionAge < maxAge) {
        // Mettre à jour l'activité
        parsedSession.lastActivity = now
        setSession(parsedSession)
        localStorage.setItem("user-session", JSON.stringify(parsedSession))
      } else {
        // Session expirée
        localStorage.removeItem("user-session")
      }
    }
    setIsLoading(false)
  }, [])

  const createSession = (userData: Omit<UserSession, "lastActivity">) => {
    const newSession: UserSession = {
      ...userData,
      lastActivity: Date.now(),
    }
    setSession(newSession)
    localStorage.setItem("user-session", JSON.stringify(newSession))
  }

  const updateSession = (updates: Partial<UserSession>) => {
    if (session) {
      const updatedSession = {
        ...session,
        ...updates,
        lastActivity: Date.now(),
      }
      setSession(updatedSession)
      localStorage.setItem("user-session", JSON.stringify(updatedSession))
    }
  }

  const destroySession = () => {
    setSession(null)
    localStorage.removeItem("user-session")
    // Nettoyer aussi les autres données de session si nécessaire
    sessionStorage.clear()
  }

  const refreshActivity = () => {
    if (session) {
      updateSession({ lastActivity: Date.now() })
    }
  }

  // Auto-refresh de l'activité toutes les 5 minutes
  useEffect(() => {
    if (session) {
      const interval = setInterval(refreshActivity, 5 * 60 * 1000)
      return () => clearInterval(interval)
    }
  }, [session])

  return {
    session,
    isLoading,
    createSession,
    updateSession,
    destroySession,
    refreshActivity,
    isAuthenticated: !!session,
  }
}

