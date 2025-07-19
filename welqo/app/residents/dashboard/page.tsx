"use client"

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
  CheckCircle,
  X,
  RotateCcw,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api"
import type { FormData } from "@/lib/api"

const countryCodeOptions = [
  { code: "+221", country: "Sénégal", flag: "🇸🇳" }, 
]

const BottomNotification = ({
  show,
  message,
  type = "success",
  onClose,
}: {
  show: boolean
  message: string
  type?: "success" | "error"
  onClose: () => void
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom-2 duration-300">
      <div
        className={`
          flex items-center space-x-3 px-6 py-4 rounded-lg shadow-lg backdrop-blur-md border
          ${
            type === "success"
              ? "bg-green-500/20 border-green-500/50 text-green-400"
              : "bg-red-500/20 border-red-500/50 text-red-400"
          }
        `}
      >
        {type === "success" && <CheckCircle className="w-5 h-5" />}
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="text-current hover:opacity-70 transition-opacity">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user, logout, isAuthenticated, isLoading } = useAuth()
  const { showToast } = useToast()
  const router = useRouter()
  const [userName, setUserName] = useState<string>("")
  const [createQROpen, setCreateQROpen] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [renewDialogOpen, setRenewDialogOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<FormData | null>(null)
  const [shareUrl, setShareUrl] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [isCreatingQR, setIsCreatingQR] = useState(false)
  const [isRenewing, setIsRenewing] = useState(false)
  const [activities, setActivities] = useState<FormData[]>([])
  const [isLoadingActivities, setIsLoadingActivities] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    countryCode: "+221",
    phone: "",
    duration: "10080",
  })
  const [renewDuration, setRenewDuration] = useState("1440")
  const [bottomNotification, setBottomNotification] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  })

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("access_token")
      const storedUserName = localStorage.getItem("user_name")

      if (!token || (!isLoading && !isAuthenticated)) {
        window.location.href = "/residents/login"
        return
      }

      if (storedUserName) {
        setUserName(storedUserName)
      } else if (user?.name) {
        setUserName(user.name)
      }
    }

    const fetchActivities = async () => {
      setIsLoadingActivities(true)
      try {
        const response = await apiClient.getUserForms()
        if (response.data && Array.isArray(response.data)) {
          const sortedActivities = response.data.sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
          )
          setActivities(sortedActivities)
        } else {
          setActivities([])
          if (response.error) {
            showToast(response.error, "error")
          }
        }
      } catch (error) {
        console.error("Error fetching activities:", error)
        showToast("Erreur lors de la récupération des activités", "error")
        setActivities([])
      } finally {
        setIsLoadingActivities(false)
      }
    }

    checkAuth()
    fetchActivities()
  }, [isAuthenticated, isLoading, user, showToast])

  const handleLogout = () => {
    logout()
    showToast("Déconnexion réussie", "success")
    router.push("/residents/login")
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
        setBottomNotification({
          show: true,
          message: `Erreur: ${response.error}`,
          type: "error",
        })
      } else if (response.data) {
        setBottomNotification({
          show: true,
          message: `✅ Code QR créé avec succès pour ${formData.name}`,
          type: "success",
        })
        if (response.data) {
          setActivities((prev) => [response.data as FormData, ...prev])
        }
        setCreateQROpen(false)
        setFormData({ name: "", countryCode: "+221", phone: "", duration: "10080" })
      }
    } catch (error) {
      console.error("Error creating QR:", error)
      showToast("Erreur lors de la création du code QR", "error")
      setBottomNotification({
        show: true,
        message: "❌ Erreur lors de la création du code QR",
        type: "error",
      })
    } finally {
      setIsCreatingQR(false)
    }
  }

  const handleRenewActivity = (activity: FormData) => {
    setSelectedActivity(activity)
    setRenewDialogOpen(true)
    setRenewDuration("1440")
  }

  const handleRenewQR = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedActivity) return

    setIsRenewing(true)

    try {
      const response = await apiClient.renewQRCode(selectedActivity.id, Number.parseInt(renewDuration))

      if (response.error) {
        showToast(response.error, "error")
        setBottomNotification({
          show: true,
          message: `Erreur: ${response.error}`,
          type: "error",
        })
      } else if (response.data) {
        setActivities((prev) =>
          prev.map((activity) => (activity.id === selectedActivity.id ? (response.data as FormData) : activity)),
        )
        setBottomNotification({
          show: true,
          message: `🔄 Code QR renouvelé avec succès pour ${selectedActivity.name}`,
          type: "success",
        })
        setRenewDialogOpen(false)
        setSelectedActivity(null)
      }
    } catch (error) {
      console.error("Error renewing QR:", error)
      showToast("Erreur lors du renouvellement du code QR", "error")
      setBottomNotification({
        show: true,
        message: "❌ Erreur lors du renouvellement du code QR",
        type: "error",
      })
    } finally {
      setIsRenewing(false)
    }
  }

  const closeBottomNotification = () => {
    setBottomNotification((prev) => ({ ...prev, show: false }))
  }

  const handleShareActivity = (activity: FormData) => {
    setSelectedActivity(activity)
    setShareDialogOpen(true)
    const shareUrl = `${window.location.origin}/residents/access/${activity.id}`
    setShareUrl(shareUrl)
  }

  const handleViewQR = (activity: FormData) => {
    router.push(`/residents/access/${activity.id}`)
  }

  const copyToClipboard = async () => {
    if (!shareUrl) return

    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Erreur lors de la copie:", err)
    }
  }

  const shareViaWhatsApp = () => {
    if (!selectedActivity || !shareUrl) return

    const expiresDate = new Date(selectedActivity.expires_at).toLocaleString("fr-FR")
    const message = `🏠 Code d'accès Welqo pour ${selectedActivity.name}\n\nLien d'accès: ${shareUrl}\n⏰ Valide jusqu'à: ${expiresDate}\n\nWelqo - Genetics Services`
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${selectedActivity.phone_number.replace(/\D/g, "")}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
  }

  const shareViaEmail = () => {
    if (!selectedActivity || !shareUrl) return

    const subject = encodeURIComponent(`Code d'accès Welqo - ${selectedActivity.name}`)
    const expiresDate = new Date(selectedActivity.expires_at).toLocaleString("fr-FR")
    const body = encodeURIComponent(`Lien d'accès: ${shareUrl}\nValide jusqu'à: ${expiresDate}`)
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  const getStatusBadge = (expiresAt: string) => {
    const now = new Date()
    const expirationDate = new Date(expiresAt)
    if (expirationDate > now) {
      return <Badge className="bg-green-500/20 text-green-400 border-green-500">Actif</Badge>
    } else {
      return <Badge className="bg-red-500/20 text-red-400 border-red-500">Expiré</Badge>
    }
  }

  const getActiveCount = () => {
    const now = new Date()
    return activities.filter((activity) => new Date(activity.expires_at) > now).length
  }

  const getExpiredCount = () => {
    const now = new Date()
    return activities.filter((activity) => new Date(activity.expires_at) <= now).length
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
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-700 bg-slate-800/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image src="/welqo-logo.png" alt="Welqo Logo" width={40} height={40} className="rounded-lg w-9 h-9" />
              <div>
                <h1 className="text-xl font-bold text-white">Tableau de bord</h1>
                <p className="text-xs text-slate-300">Bienvenue, {userName || "Utilisateur"}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/residents/settings" className="hover:bg-slate-700 p-2 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-slate-300 hover:text-white" />
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="hover:bg-slate-700 p-2 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 text-slate-300 hover:text-white" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 pt-20">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Bonjour, {userName || "Utilisateur"} 👋</h2>
            <p className="text-slate-300">
              Gérez votre système de contrôle d'accès résidentiel depuis votre tableau de bord.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Dialog open={createQROpen} onOpenChange={setCreateQROpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto bg-amber-400 text-slate-900 hover:bg-amber-500">
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
                        <SelectItem value="720">12 heures</SelectItem>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Codes QR Actifs</CardTitle>
              <QrCode className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{getActiveCount()}</div>
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
              <CardTitle className="text-sm font-medium text-slate-400">Codes Expirés</CardTitle>
              <Activity className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{getExpiredCount()}</div>
              <p className="text-xs text-slate-400">Codes expirés</p>
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

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>Activités Récentes</span>
            </CardTitle>
            <CardDescription className="text-slate-400">Derniers codes QR créés et leur statut</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingActivities ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-slate-400">Chargement des activités...</p>
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Aucune activité récente</p>
                <p className="text-sm text-slate-500 mt-2">Créez votre premier code QR pour commencer</p>
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center">
                        <QrCode className="w-5 h-5 text-slate-900" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{activity.name}</h4>
                        <p className="text-sm text-slate-400">{activity.phone_number}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span className="text-xs text-slate-500">
                            Créé le {new Date(activity.created_at).toLocaleDateString("fr-FR")} à{" "}
                            {new Date(activity.created_at).toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span className="text-xs text-slate-500">
                            Expire le {new Date(activity.expires_at).toLocaleDateString("fr-FR")} à{" "}
                            {new Date(activity.expires_at).toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 mt-2 sm:mt-0">
                      {getStatusBadge(activity.expires_at)}
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRenewActivity(activity)}
                          className="text-slate-400 hover:text-amber-400 p-2"
                          title="Renouveler la durée"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

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
                <div className="space-y-3">
                  <Label className="text-white font-medium">Lien d'accès</Label>
                  <div className="flex items-center space-x-2">
                    <Input value={shareUrl} readOnly className="bg-slate-700 border-slate-600 text-white text-sm" />
                    <Button
                      size="sm"
                      onClick={copyToClipboard}
                      className="bg-amber-400 text-slate-900 hover:bg-amber-500"
                      disabled={!shareUrl}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  {copied && <p className="text-green-400 text-sm">Lien copié !</p>}
                </div>
                <div className="space-y-3">
                  <Label className="text-white font-medium">Partager via</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={shareViaWhatsApp}
                      className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white bg-transparent"
                      disabled={!shareUrl}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                    <Button
                      variant="outline"
                      onClick={shareViaEmail}
                      className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white bg-transparent"
                      disabled={!shareUrl}
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

        <Dialog open={renewDialogOpen} onOpenChange={setRenewDialogOpen}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">Renouveler le code QR</DialogTitle>
              <DialogDescription className="text-slate-400">
                {selectedActivity && `Renouveler le code QR pour ${selectedActivity.name}`}
              </DialogDescription>
            </DialogHeader>
            {selectedActivity && (
              <form onSubmit={handleRenewQR} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="renewDuration" className="text-white font-medium">
                    Durée supplémentaire
                  </Label>
                  <Select value={renewDuration} onValueChange={setRenewDuration}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 heure</SelectItem>
                      <SelectItem value="120">2 heures</SelectItem>
                      <SelectItem value="240">4 heures</SelectItem>
                      <SelectItem value="480">8 heures</SelectItem>
                      <SelectItem value="720">12 heures</SelectItem>
                      <SelectItem value="1440">24 heures</SelectItem>
                      <SelectItem value="2880">48 heures</SelectItem>
                      <SelectItem value="4320">3 jours</SelectItem>
                      <SelectItem value="10080">7 jours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setRenewDialogOpen(false)}
                    className="border-slate-600 text-slate-400 hover:bg-slate-700 hover:text-white"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    className="bg-amber-400 text-slate-900 hover:bg-amber-500"
                    disabled={isRenewing}
                  >
                    {isRenewing ? "Renouvellement..." : "Renouveler"}
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </main>

      <BottomNotification
        show={bottomNotification.show}
        message={bottomNotification.message}
        type={bottomNotification.type}
        onClose={closeBottomNotification}
      />
    </div>
  )
}
