"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, Shield, Clock, SettingsIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

export default function SettingsPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [userName, setUserName] = useState<string>("")

  useEffect(() => {
    // Vérification de l'authentification
    const checkAuth = () => {
      const token = localStorage.getItem("access_token")
      const storedUserName = localStorage.getItem("user_name")

      if (!token || (!isLoading && !isAuthenticated)) {
        window.location.href = "/login"
        return
      }

      if (storedUserName) {
        setUserName(storedUserName)
      } else if (user?.name) {
        setUserName(user.name)
      }
    }

    checkAuth()
  }, [isAuthenticated, isLoading, user])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white text-lg">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link href="/residents/dashboard">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white p-1 sm:p-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <Image
              src="/logo-alt.jpeg"
              alt="Welqo Logo"
              width={40}
              height={40}
              className="rounded-lg w-8 h-8 sm:w-10 sm:h-10"
            />
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white">Paramètres</h1>
              <p className="text-xs sm:text-sm text-slate-400">Gérer votre compte et vos préférences</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Paramètres du compte</h2>
            <p className="text-slate-300">Gérez vos informations personnelles et les paramètres de votre compte.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Profile Card */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <User className="w-5 h-5 text-amber-400" />
                  <span>Profil Utilisateur</span>
                </CardTitle>
                <CardDescription className="text-slate-400">Informations de votre compte</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Nom:</span>
                    <span className="text-white font-medium">{userName || "Non défini"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Statut:</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500">Actif</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Type de compte:</span>
                    <span className="text-white">Résident</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Dernière connexion:</span>
                    <span className="text-white">{new Date().toLocaleDateString("fr-FR")}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <Link href="/change-password">
                    <Button className="w-full bg-amber-400 text-slate-900 hover:bg-amber-500">
                      <SettingsIcon className="w-4 h-4 mr-2" />
                      Modifier le mot de passe
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Account Security */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-amber-400" />
                  <span>Sécurité du Compte</span>
                </CardTitle>
                <CardDescription className="text-slate-400">Paramètres de sécurité et confidentialité</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Authentification:</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500">Sécurisée</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Dernière modification:</span>
                    <span className="text-white">Jamais</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Sessions actives:</span>
                    <span className="text-white">1 session</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700 space-y-2">
                  <Button
                    variant="outline"
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                    disabled
                  >
                    Authentification à deux facteurs
                    <span className="text-xs text-slate-500 ml-2">(Bientôt)</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                    disabled
                  >
                    Gérer les sessions
                    <span className="text-xs text-slate-500 ml-2">(Bientôt)</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Statistics */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <span>Statistiques du Compte</span>
                </CardTitle>
                <CardDescription className="text-slate-400">Votre activité sur la plateforme</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Codes QR créés:</span>
                    <span className="text-white font-medium">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Visiteurs reçus:</span>
                    <span className="text-white font-medium">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Accès validés:</span>
                    <span className="text-white font-medium">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Membre depuis:</span>
                    <span className="text-white font-medium">{new Date().toLocaleDateString("fr-FR")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <SettingsIcon className="w-5 h-5 text-amber-400" />
                  <span>Préférences</span>
                </CardTitle>
                <CardDescription className="text-slate-400">Personnalisez votre expérience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Notifications:</span>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500">Activées</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Langue:</span>
                    <span className="text-white">Français</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Fuseau horaire:</span>
                    <span className="text-white">Europe/Paris</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700 space-y-2">
                  <Button
                    variant="outline"
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                    disabled
                  >
                    Gérer les notifications
                    <span className="text-xs text-slate-500 ml-2">(Bientôt)</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                    disabled
                  >
                    Paramètres avancés
                    <span className="text-xs text-slate-500 ml-2">(Bientôt)</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Back to Dashboard */}
          <div className="mt-8 text-center">
            <Link href="/redisents/dashboard">
              <Button variant="ghost" className="text-slate-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour au tableau de bord
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

