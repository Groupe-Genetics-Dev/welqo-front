"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Eye, EyeOff, Check } from "lucide-react"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"phone" | "new-password" | "success">("phone")
  const [countryCode, setCountryCode] = useState("+33")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const fullPhoneNumber = countryCode + phoneNumber

    if (!phoneNumber.match(/^[0-9]{8,12}$/)) {
      setError("Veuillez entrer un numéro de téléphone valide")
      return
    }

    setIsLoading(true)

    try {
      // Ici, vous feriez un appel API pour envoyer un code de vérification
      // const response = await fetch('/api/send-verification', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ phone_number: phoneNumber })
      // });

      // if (!response.ok) throw new Error('Erreur lors de l\'envoi du code');

      // Simulation de délai réseau
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setStep("new-password")
    } catch (err) {
      setError("Une erreur est survenue lors de l'envoi du code")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (newPassword.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }

    setIsLoading(true)

    try {
      // Ici, vous feriez un appel API pour réinitialiser le mot de passe
      // const response = await fetch('/api/reset-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     phone_number: phoneNumber,
      //     new_password: newPassword
      //   })
      // });

      // if (!response.ok) throw new Error('Erreur lors de la réinitialisation');

      // Simulation de délai réseau
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setStep("success")
    } catch (err) {
      setError("Une erreur est survenue lors de la réinitialisation du mot de passe")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (step) {
      case "phone":
        return (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone_number" className="text-white">
                Numéro de téléphone
              </Label>
              <div className="flex space-x-2">
                <Select value={countryCode} onValueChange={(value) => setCountryCode(value)}>
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
                  id="phone_number"
                  type="tel"
                  placeholder="Entrez votre numéro de téléphone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""))}
                  className="flex-1 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-amber-400 text-slate-900 hover:bg-amber-500"
              disabled={isLoading}
            >
              {isLoading ? "Envoi en cours..." : "Envoyer le code de vérification"}
            </Button>
          </form>
        )

      case "new-password":
        return (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new_password" className="text-white">
                Nouveau mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="new_password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Entrez votre nouveau mot de passe"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_password" className="text-white">
                Confirmer le mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirmez votre nouveau mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-amber-400 text-slate-900 hover:bg-amber-500"
              disabled={isLoading}
            >
              {isLoading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
            </Button>
          </form>
        )

      case "success":
        return (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white">Mot de passe réinitialisé</h3>
            <p className="text-slate-400">
              Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre
              nouveau mot de passe.
            </p>
            <Button
              className="w-full bg-amber-400 text-slate-900 hover:bg-amber-500"
              onClick={() => router.push("/login")}
            >
              Se connecter
            </Button>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-center mb-6 sm:mb-8">
          <Image
            src="/logo-alt.jpeg"
            alt="Welqo Logo"
            width={80}
            height={80}
            className="rounded-lg w-16 h-16 sm:w-20 sm:h-20"
          />
        </div>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <div className="flex items-center space-x-2">
              {step !== "success" && (
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </Link>
              )}
              <CardTitle className="text-2xl text-white">Mot de passe oublié</CardTitle>
            </div>
            <CardDescription className="text-slate-400">
              {step === "phone" && "Entrez votre numéro de téléphone pour réinitialiser votre mot de passe"}
              {step === "new-password" && "Créez un nouveau mot de passe sécurisé"}
              {step === "success" && "Votre mot de passe a été réinitialisé avec succès"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-md mb-4">{error}</div>
            )}

            {renderStepContent()}
          </CardContent>

          {step !== "success" && (
            <CardFooter className="flex justify-center border-t border-slate-700 pt-4">
              <Link href="/login" className="text-sm text-amber-400 hover:text-amber-300">
                Retour à la connexion
              </Link>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}
