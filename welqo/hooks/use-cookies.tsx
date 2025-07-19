"use client"

import { useState, useEffect } from "react"

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

export function useCookies() {
  const [cookiesAccepted, setCookiesAccepted] = useState<boolean | null>(null)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà accepté les cookies
    const accepted = localStorage.getItem("cookies-accepted")
    const savedPreferences = localStorage.getItem("cookie-preferences")

    if (accepted) {
      setCookiesAccepted(accepted === "true")
    }

    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences))
    }
  }, [])

  const acceptAllCookies = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    }
    setPreferences(allAccepted)
    setCookiesAccepted(true)
    localStorage.setItem("cookies-accepted", "true")
    localStorage.setItem("cookie-preferences", JSON.stringify(allAccepted))
  }

  const acceptNecessaryOnly = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
    }
    setPreferences(necessaryOnly)
    setCookiesAccepted(true)
    localStorage.setItem("cookies-accepted", "true")
    localStorage.setItem("cookie-preferences", JSON.stringify(necessaryOnly))
  }

  const updatePreferences = (newPreferences: CookiePreferences) => {
    setPreferences(newPreferences)
    localStorage.setItem("cookie-preferences", JSON.stringify(newPreferences))
  }

  const setCookie = (name: string, value: string, days = 30) => {
    if (preferences.necessary || name.startsWith("necessary-")) {
      const expires = new Date()
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
    }
  }

  const getCookie = (name: string): string | null => {
    const nameEQ = name + "="
    const ca = document.cookie.split(";")
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === " ") c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  }

  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  }

  return {
    cookiesAccepted,
    preferences,
    acceptAllCookies,
    acceptNecessaryOnly,
    updatePreferences,
    setCookie,
    getCookie,
    deleteCookie,
  }
}

