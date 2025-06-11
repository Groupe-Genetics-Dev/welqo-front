"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { ArrowLeft, QrCode, Share2, Download, Copy, Check, MessageCircle, Mail, Facebook, Twitter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

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

export default function CreateAppointmentPage() {
  const [formData, setFormData] = useState({
    name: "",
    countryCode: "+33",
    phone: "",
    duration: "60",
  })
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const router = useRouter()
  const [appointmentId, setAppointmentId] = useState<string>("")

  const generateQRCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulation de génération de QR code
    setTimeout(() => {
      // Génération d'un QR code simulé (base64)
      const mockQRCode = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`
      setQrCode(mockQRCode)
      // Générer un ID unique pour l'accès
      const uniqueId = Math.random().toString(36).substring(2, 15)
      setAppointmentId(uniqueId)
      setIsLoading(false)
    }, 1500)
  }

  const shareLink = `${window.location.origin}/access/${appointmentId}`

  const shareMessage = `🏠 Code d'accès Welqo pour ${formData.name}

Bonjour ${formData.name},

Voici votre code QR d'accès temporaire pour l'immeuble.

📱 Lien d'accès: ${shareLink}
⏰ Valide pendant: ${formData.duration} minutes
📞 Contact: ${formData.countryCode}${formData.phone}

Présentez ce code au gardien à votre arrivée.

Cordialement,
Welqo - Genetics Services`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Erreur lors de la copie:", err)
    }
  }

  const shareViaWhatsApp = () => {
    const fullPhoneNumber = formData.countryCode + formData.phone.replace(/\D/g, "")
    const encodedMessage = encodeURIComponent(shareMessage)
    const whatsappUrl = `https://wa.me/${fullPhoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
  }

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Code d'accès Welqo - ${formData.name}`)
    const body = encodeURIComponent(shareMessage)
    const emailUrl = `mailto:?subject=${subject}&body=${body}`
    window.open(emailUrl)
  }

  const shareViaFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`
    window.open(facebookUrl, "_blank", "width=600,height=400")
  }

  const shareViaTwitter = () => {
    const text = encodeURIComponent(`Code d'accès Welqo généré pour ${formData.name}`)
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareLink)}`
    window.open(twitterUrl, "_blank", "width=600,height=400")
  }

  const shareViaNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Code d'accès Welqo - ${formData.name}`,
          text: shareMessage,
          url: shareLink,
        })
      } catch (error) {
        console.log("Partage annulé")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link href="/dashboard">
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
              <h1 className="text-lg sm:text-xl font-bold text-white">Nouveau Rendez-vous</h1>
              <p className="text-xs sm:text-sm text-slate-400">Générer un code QR d'accès</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {!qrCode ? (
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Informations du visiteur</CardTitle>
                <CardDescription className="text-slate-400">
                  Remplissez les informations pour générer le code QR d'accès
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={generateQRCode} className="space-y-6">
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
                        placeholder="Entrez le numéro de téléphone"
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
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>Génération en cours...</>
                    ) : (
                      <>
                        <QrCode className="w-4 h-4 mr-2" />
                        Générer le code QR
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Code QR généré avec succès</CardTitle>
                  <CardDescription className="text-slate-400">Partagez ce code avec {formData.name}</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <div className="bg-white p-8 rounded-lg inline-block">
                    <div className="w-48 h-48 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                      <QrCode className="w-32 h-32 text-slate-900" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">{formData.name}</h3>
                    <p className="text-slate-400">
                      {formData.countryCode}
                      {formData.phone}
                    </p>
                    <p className="text-sm text-slate-400">Valide pendant {formData.duration} minutes</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-amber-400 text-slate-900 hover:bg-amber-500">
                          <Share2 className="w-4 h-4 mr-2" />
                          Partager
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-white">Partager le code d'accès</DialogTitle>
                          <DialogDescription className="text-slate-400">
                            Choisissez comment partager le code QR avec {formData.name}
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                          {/* Lien de partage */}
                          <div className="space-y-3">
                            <Label className="text-white font-medium">Lien d'accès</Label>
                            <div className="flex items-center space-x-2">
                              <Input
                                value={shareLink}
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
                                onClick={shareViaEmail}
                                className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                              >
                                <Mail className="w-4 h-4 mr-2" />
                                Email
                              </Button>

                              <Button
                                variant="outline"
                                onClick={shareViaFacebook}
                                className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                              >
                                <Facebook className="w-4 h-4 mr-2" />
                                Facebook
                              </Button>

                              <Button
                                variant="outline"
                                onClick={shareViaTwitter}
                                className="border-sky-500 text-sky-400 hover:bg-sky-500 hover:text-white"
                              >
                                <Twitter className="w-4 h-4 mr-2" />
                                Twitter
                              </Button>
                            </div>
                          </div>

                          {/* Partage natif (mobile) */}
                          {navigator.share && (
                            <Button
                              onClick={shareViaNative}
                              className="w-full bg-amber-400 text-slate-900 hover:bg-amber-500"
                            >
                              <Share2 className="w-4 h-4 mr-2" />
                              Plus d'options
                            </Button>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      className="border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-slate-900"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-slate-400 hover:text-white">
                    Retour au dashboard
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
