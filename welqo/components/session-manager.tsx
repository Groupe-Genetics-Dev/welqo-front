"use client"

import type React from "react"

import { useEffect } from "react"
import { useSession } from "@/hooks/use-session"
import { useCookies } from "@/hooks/use-cookies"


interface SessionManagerProps {
  children: React.ReactNode
}

export function SessionManager({ children }: SessionManagerProps) {
  const { session, refreshActivity } = useSession()
  const { setCookie, preferences } = useCookies()

  useEffect(() => {
    // Suivre l'activité de l'utilisateur si les cookies analytiques sont acceptés
    if (preferences.analytics && session) {
      const handleActivity = () => {
        refreshActivity()
        setCookie("last-activity", Date.now().toString(), 1)
      }

      // Écouter les événements d'activité
      const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"]

      events.forEach((event) => {
        document.addEventListener(event, handleActivity, { passive: true })
      })

      return () => {
        events.forEach((event) => {
          document.removeEventListener(event, handleActivity)
        })
      }
    }
  }, [session, preferences.analytics, refreshActivity, setCookie])

  useEffect(() => {
    // Sauvegarder les préférences utilisateur si connecté
    if (session && preferences.necessary) {
      setCookie(
        "user-preferences",
        JSON.stringify({
          theme: "light",
          language: "fr",
          notifications: true,
        }),
        30,
      )
    }
  }, [session, preferences.necessary, setCookie])

  return <>{children}</>
}

