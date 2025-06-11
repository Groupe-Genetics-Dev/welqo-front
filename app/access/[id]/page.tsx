"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Download, Calendar, Clock, User, QrCode } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface AccessData {
  id: string
  name: string
  expiresAt: string
  createdAt: string
  status: "active" | "expired" | "used"
}

export default function AccessPage() {
  const params = useParams()
  const id = params?.id as string
  const [accessData, setAccessData] = useState<AccessData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAccessData = async () => {
      try {
        // Ici, vous feriez un appel API pour récupérer les données du code QR
        // const response = await fetch(`/api/access/${id}`);
        // if (!response.ok) throw new Error("Code d'accès invalide ou expiré");
        // const data = await response.json();

        // Simulation de données pour la démo
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Données simulées
        const mockData: AccessData = {
          id,
          name: "Marie Dubois",
          expiresAt: new Date(Date.now() + 3600000).toISOString(), // Expire dans 1 heure
          createdAt: new Date().toISOString(),
          status: "active",
        }

        setAccessData(mockData)
      } catch (err) {
        console.error("Erreur lors de la récupération des données:", err)
        setError("Ce code d'accès est invalide ou a expiré")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchAccessData()
    }
  }, [id])

  const handleDownload = () => {
    // Création d'un élément canvas pour générer l'image
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Dimensions du canvas
    canvas.width = 300
    canvas.height = 300

    // Dessiner un fond blanc
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Dessiner un QR code simulé (carré noir)
    ctx.fillStyle = "#000000"
    ctx.fillRect(50, 50, 200, 200)

    // Convertir le canvas en URL de données
    const dataUrl = canvas.toDataURL("image/png")

    // Créer un lien de téléchargement
    const link = document.createElement("a")
    link.href = dataUrl
    link.download = `welqo-access-${id}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white text-lg">Chargement du code d'accès...</p>
        </div>
      </div>
    )
  }

  if (error || !accessData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <Image src="/logo-alt.jpeg" alt="Welqo Logo" width={60} height={60} className="rounded-lg" />
            </div>
            <CardTitle className="text-2xl text-white text-center">Accès non disponible</CardTitle>
            <CardDescription className="text-slate-400 text-center">
              {error || "Ce code d'accès est invalide ou a expiré"}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center pt-2">
            <Link href="/">
              <Button className="bg-amber-400 text-slate-900 hover:bg-amber-500">Retour à l'accueil</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const expired = isExpired(accessData.expiresAt)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <Image src="/logo-alt.jpeg" alt="Welqo Logo" width={60} height={60} className="rounded-lg" />
          </div>
          <CardTitle className="text-2xl text-white text-center">Code d'accès</CardTitle>
          <CardDescription className="text-slate-400 text-center">
            {expired ? "Ce code d'accès a expiré" : "Présentez ce code QR au gardien à votre arrivée"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* QR Code */}
          <div className="flex justify-center">
            <div className={`bg-white p-4 rounded-lg ${expired ? "opacity-50" : ""}`}>
              <div className="w-64 h-64 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                <QrCode className="w-48 h-48 text-slate-900" />
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex justify-center">
            <div
              className={`px-4 py-2 rounded-full ${
                expired ? "bg-red-500/20 text-red-300" : "bg-green-500/20 text-green-300"
              }`}
            >
              {expired ? "Expiré" : "Actif"}
            </div>
          </div>

          {/* Visitor Info */}
          <div className="bg-slate-700/50 p-4 rounded-lg space-y-3">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-sm text-slate-400">Visiteur</p>
                <p className="text-white">{accessData.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-sm text-slate-400">Date de création</p>
                <p className="text-white">{formatDate(accessData.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-sm text-slate-400">Expire le</p>
                <p className={expired ? "text-red-300" : "text-white"}>{formatDate(accessData.expiresAt)}</p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center pt-2">
          <Button
            onClick={handleDownload}
            className="bg-amber-400 text-slate-900 hover:bg-amber-500"
            disabled={expired}
          >
            <Download className="w-4 h-4 mr-2" />
            Télécharger le QR code
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
