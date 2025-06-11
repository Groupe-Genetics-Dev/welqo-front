"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Settings,
  LogOut,
  Shield,
  Clock,
  QrCode,
  Users,
  Activity,
  Plus,
  Share2,
  Eye,
  Copy,
  MessageCircle,
  Mail,
  Check,
  Calendar,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api"

const countryCodeOptions = [
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+1", country: "États-Unis", flag: "🇺🇸" },
  { code: "+44", country: "Royaume-Uni", flag: "🇬🇧" },
  { code: "+49", country: "Allemagne", flag: "🇩🇪" },
  { code: "+39", country: "Italie", flag: "🇮🇹" },
  { code: "+34", country: "Espagne", flag: "🇪🇸" },
  { code: "+32", country: "Belgique", flag: "🇧🇪" },
  { code: "+41", country: "Suisse", flag: "🇨🇭" },
  { code: "+31", country: "Pays-Bas", flag: "🇳🇱" },
  { code: "+43", country: "Autriche", flag: "🇦🇹" },
  { code: "+351", country: "Portugal", flag: "🇵🇹" },
  { code: "+212", country: "Maroc", flag: "🇲🇦" },
  { code: "+213", country: "Algérie", flag: "🇩🇿" },
  { code: "+216", country: "Tunisie", flag: "🇹🇳" },
  { code: "+221", country: "Sénégal", flag: "🇸🇳" },
  { code: "+225", country: "Côte d'Ivoire", flag: "🇨🇮" },
  { code: "+237", country: "Cameroun", flag: "🇨🇲" },
]

interface QRActivity {
  id: string
  name: string
  phone: string
  createdAt: string
  expiresAt: string
  status: "active" | "expired" | "used"
  duration: number
}

export default function DashboardPage() {
  const { user, logout, isAuthenticated, isLoading } = useAuth()
  const { showToast } = useToast()
  const router = useRouter()
  const [userName, setUserName] = useState<string>("")
  const [createQROpen, setCreateQROpen] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<QRActivity | null>(null)
  const [copied, setCopied] = useState(false)
  const [isCreatingQR, setIsCreatingQR] = useState(false)
  const [activities, setActivities] = useState<QRActivity[]>([])
  const [formData, setFormData] = useState({
    name: "",
    countryCode: "+33",
    phone: "",
    duration: "60",
  })

  useEffect(() => {
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

    const fetchActivities = async () => {
      try {
        const response = await apiClient.getUserForms()
        if (response.data) {
          setActivities(response.data)
        } else {
          showToast(response.error || "Failed to fetch activities", "error")
        }
      } catch (error) {
        showToast("Error fetching activities", "error")
      }
    }

    checkAuth()
    fetchActivities()
  }, [isAuthenticated, isLoading, user])

  const handleLogout = () => {
    logout()
    showToast("Déconnexion réussie", "success")
    router.push("/login")
  }

  const handleCreateQR = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreatingQR(true)

    try {
      const fullPhoneNumber = formData.countryCode + formData.phone

      const response = await apiClient.createForm({
        name: formData.name,
        phone_number: fullPhoneNumber,
        duration_minutes: Number.parseInt(formData.duration),
      })

      if (response.error) {
        showToast(response.error, "error")
      } else {
        showToast("Code QR créé avec succès", "success")

        const newActivity: QRActivity = {
          id: response.data.id || Math.random().toString(36).substring(2, 15),
          name: formData.name,
          phone: fullPhoneNumber,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + Number.parseInt(formData.duration) * 60000).toISOString(),
          status: "active",
          duration: Number.parseInt(formData.duration),
        }

        setActivities((prev) => [newActivity, ...prev])
        setCreateQROpen(false)
        setFormData({ name: "", countryCode: "+33", phone: "", duration: "60" })
      }
    } catch (error) {
      showToast("Erreur lors de la création du code QR", "error")
    } finally {
      setIsCreatingQR(false)
    }
  }

  const handleShareActivity = (activity: QRActivity) => {
    setSelectedActivity(activity)
    setShareDialogOpen(true)
  }

  const handleViewQR = (activity: QRActivity) => {
    router.push(`/access/${activity.id}`)
  }

  const copyToClipboard = async () => {
    if (!selectedActivity) return

    try {
      const shareLink = `${window.location.origin}/access/${selectedActivity.id}`
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Erreur lors de la copie:", err)
    }
  }

  const shareViaWhatsApp = () => {
    if (!selectedActivity) return

    const shareLink = `${window.location.origin}/access/${selectedActivity.id}`
    const message = `🏠 Code d'accès Welqo pour ${selectedActivity.name}\n\nLien d'accès: ${shareLink}\n⏰ Valide jusqu'à: ${new Date(selectedActivity.expiresAt).toLocaleString("fr-FR")}\n\nWelqo - Genetics Services`
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${selectedActivity.phone.replace(/\D/g, "")}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500">Actif</Badge>
      case "expired":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500">Expiré</Badge>
      case "used":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500">Utilisé</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500">Inconnu</Badge>
    }
  }

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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Image
                src="/logo-alt.jpeg"
                alt="Welqo Logo"
                width={40}
                height={40}
                className="rounded-lg w-8 h-8 sm:w-10 sm:h-10"
              />
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">Tableau de bord</h1>
                <p className="text-xs sm:text-sm text-slate-400">Bienvenue, {userName || "Utilisateur"}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/settings">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-400 hover:text-white">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Bonjour, {userName || "Utilisateur"} 👋</h2>
            <p className="text-slate-300">
              Gérez votre système de contrôle d'accès résidentiel depuis votre tableau de bord.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Dialog open={createQROpen} onOpenChange={setCreateQROpen}>
              <DialogTrigger asChild>
                <Button className="bg-amber-400 text-slate-900 hover:bg-amber-500">
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un code QR
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-white">Créer un nouveau code QR</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Remplissez les informations pour générer un code d'accès
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleCreateQR} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">
                      Nom du visiteur
                    </Label>
                    <Input
                      id="name"
                      placeholder="Entrez le nom du visiteur"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white">
                      Numéro de téléphone
                    </Label>
                    <div className="flex space-x-2">
                      <Select
                        value={formData.countryCode}
                        onValueChange={(value) => setFormData({ ...formData, countryCode: value })}
                      >
                        <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600 max-h-60">
                          {countryCodeOptions.map((option, index) => (
                            <SelectItem
                              key={`${option.code}-${option.country}-${index}`}
                              value={option.code}
                              className="text-white"
                            >
                              <span className="flex items-center space-x-2">
                                <span>{option.flag}</span>
                                <span>{option.code}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Numéro de téléphone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, "") })}
                        className="flex-1 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration" className="text-white">
                      Durée d'accès
                    </Label>
                    <Select
                      value={formData.duration}
                      onValueChange={(value) => setFormData({ ...formData, duration: value })}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 heure</SelectItem>
                        <SelectItem value="120">2 heures</SelectItem>
                        <SelectItem value="240">4 heures</SelectItem>
                        <SelectItem value="480">8 heures</SelectItem>
                        <SelectItem value="1440">24 heures</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-amber-400 text-slate-900 hover:bg-amber-500"
                    disabled={isCreatingQR}
                  >
                    {isCreatingQR ? "Création..." : "Créer le code QR"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Codes QR Actifs</CardTitle>
              <QrCode className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {activities.filter((a) => a.status === "active").length}
              </div>
              <p className="text-xs text-slate-400">Codes en cours</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Visiteurs</CardTitle>
              <Users className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{activities.length}</div>
              <p className="text-xs text-slate-400">Codes créés</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Codes Utilisés</CardTitle>
              <Activity className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {activities.filter((a) => a.status === "used").length}
              </div>
              <p className="text-xs text-slate-400">Accès validés</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Statut Système</CardTitle>
              <Shield className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">Actif</div>
              <p className="text-xs text-slate-400">Système opérationnel</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>Activités Récentes</span>
            </CardTitle>
            <CardDescription className="text-slate-400">Derniers codes QR créés et leur statut</CardDescription>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Aucune activité récente</p>
                <p className="text-sm text-slate-500 mt-2">Créez votre premier code QR pour commencer</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center">
                        <QrCode className="w-5 h-5 text-slate-900" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{activity.name}</h4>
                        <p className="text-sm text-slate-400">{activity.phone}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span className="text-xs text-slate-500">
                            {new Date(activity.createdAt).toLocaleDateString("fr-FR")} à{" "}
                            {new Date(activity.createdAt).toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {getStatusBadge(activity.status)}
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewQR(activity)}
                          className="text-slate-400 hover:text-white p-2"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShareActivity(activity)}
                          className="text-slate-400 hover:text-white p-2"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Share Dialog */}
        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">Partager le code d'accès</DialogTitle>
              <DialogDescription className="text-slate-400">
                {selectedActivity && `Partager le code QR de ${selectedActivity.name}`}
              </DialogDescription>
            </DialogHeader>

            {selectedActivity && (
              <div className="space-y-6">
                {/* Lien de partage */}
                <div className="space-y-3">
                  <Label className="text-white font-medium">Lien d'accès</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={`${window.location.origin}/access/${selectedActivity.id}`}
                      readOnly
                      className="bg-slate-700 border-slate-600 text-white text-sm"
                    />
                    <Button
                      size="sm"
                      onClick={copyToClipboard}
                      className="bg-amber-400 text-slate-900 hover:bg-amber-500"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  {copied && <p className="text-green-400 text-sm">Lien copié !</p>}
                </div>

                {/* Options de partage */}
                <div className="space-y-3">
                  <Label className="text-white font-medium">Partager via</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={shareViaWhatsApp}
                      className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => {
                        const subject = encodeURIComponent(`Code d'accès Welqo - ${selectedActivity.name}`)
                        const body = encodeURIComponent(
                          `Lien d'accès: ${window.location.origin}/access/${selectedActivity.id}`,
                        )
                        window.open(`mailto:?subject=${subject}&body=${body}`)
                      }}
                      className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}

