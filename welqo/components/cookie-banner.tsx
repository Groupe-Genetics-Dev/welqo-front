"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Cookie, Settings, X } from "lucide-react"
import { useCookies } from "@/hooks/use-cookies"


export function CookieBanner() {
  const { cookiesAccepted, preferences, acceptAllCookies, acceptNecessaryOnly, updatePreferences } = useCookies()
  const [showSettings, setShowSettings] = useState(false)
  const [tempPreferences, setTempPreferences] = useState(preferences)

  if (cookiesAccepted !== null && cookiesAccepted) {
    return null
  }

  const handleSavePreferences = () => {
    updatePreferences(tempPreferences)
    setShowSettings(false)
    acceptNecessaryOnly() // Marquer comme accepté avec les préférences personnalisées
  }

  if (showSettings) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Paramètres des cookies
              </CardTitle>
              <CardDescription>Personnalisez vos préférences de cookies</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">Cookies nécessaires</h4>
                  <p className="text-sm text-gray-600">Ces cookies sont essentiels au fonctionnement du site</p>
                  <Badge variant="secondary" className="mt-1">
                    Obligatoire
                  </Badge>
                </div>
                <Switch checked={true} disabled />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">Cookies analytiques</h4>
                  <p className="text-sm text-gray-600">Nous aident à comprendre comment vous utilisez notre site</p>
                </div>
                <Switch
                  checked={tempPreferences.analytics}
                  onCheckedChange={(checked) => setTempPreferences((prev) => ({ ...prev, analytics: checked }))}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">Cookies marketing</h4>
                  <p className="text-sm text-gray-600">Utilisés pour personnaliser les publicités et le contenu</p>
                </div>
                <Switch
                  checked={tempPreferences.marketing}
                  onCheckedChange={(checked) => setTempPreferences((prev) => ({ ...prev, marketing: checked }))}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSavePreferences} className="flex-1">
                Sauvegarder les préférences
              </Button>
              <Button variant="outline" onClick={acceptAllCookies} className="flex-1 bg-transparent">
                Tout accepter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="mx-auto max-w-4xl border-[#efb83b]/30 bg-white/95 backdrop-blur-md shadow-2xl">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="w-6 h-6 text-[#efb83b] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Nous utilisons des cookies</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Nous utilisons des cookies pour améliorer votre expérience sur notre site, analyser le trafic et
                  personnaliser le contenu. En continuant à naviguer, vous acceptez notre utilisation des cookies.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <Button variant="outline" size="sm" onClick={() => setShowSettings(true)} className="text-xs">
                <Settings className="w-4 h-4 mr-1" />
                Paramètres
              </Button>
              <Button
                size="sm"
                onClick={acceptAllCookies}
                className="bg-gradient-to-r from-[#082038] to-[#efb83b] hover:from-[#082038] hover:to-[#efb83b] text-white text-xs"
              >
                Tout accepter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

