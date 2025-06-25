"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Eye, EyeOff, Building } from "lucide-react"
import Image from "next/image"
import { OwnerApiClient } from "@/lib/owner-api"

export default function OwnerRegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+221",
    phoneNumber: "",
    company: "",
    password: "",
    confirmPassword: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const countryCodes = [
    { code: "+1", name: "USA" },
    { code: "+44", name: "UK" },
    { code: "+33", name: "France" },
    { code: "+221", name: "Senegal" },
  ]

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^[0-9]{8,15}$/
    return phoneRegex.test(phone)
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      console.error("Le nom est requis")
      return
    }

    if (!formData.phoneNumber.trim()) {
      console.error("Le numéro de téléphone est requis")
      return
    }

    if (!validatePhoneNumber(formData.phoneNumber)) {
      console.error("Veuillez entrer un numéro de téléphone valide")
      return
    }

    if (formData.password.length < 8) {
      console.error("Le mot de passe doit contenir au moins 8 caractères")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      console.error("Les mots de passe ne correspondent pas")
      return
    }

    setIsLoading(true)

    try {
      const ownerData = {
        name: formData.name.trim(),
        phone_number: `${formData.countryCode}${formData.phoneNumber.trim()}`,
        password: formData.password,
      }

      const newOwner = await OwnerApiClient.createOwner(ownerData)
      router.push("/owner/login")

    } catch (error) {
      console.error("Erreur lors de la création du compte:", error)
    } finally {
      setIsLoading(false)
    }
  }

  interface OwnerRegisterFormData {
    name: string
    email: string
    countryCode: string
    phoneNumber: string
    company: string
    password: string
    confirmPassword: string
  }

  type OwnerRegisterFormField = keyof OwnerRegisterFormData

  const handleInputChange = (field: OwnerRegisterFormField, value: string) => {
    setFormData((prev: OwnerRegisterFormData) => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-6 sm:mb-8">
          <div className="flex items-center space-x-3">
            <Image
              src="/logo-alt.jpeg"
              alt="Welqo Logo"
              width={60}
              height={60}
              className="rounded-lg w-12 h-12 sm:w-15 sm:h-15"
            />
            <Building className="w-8 h-8 text-amber-400" />
          </div>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <div className="flex items-center space-x-2">
              <Link href="/owner/login">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <CardTitle className="text-2xl text-white">Inscription Propriétaire</CardTitle>
            </div>
            <CardDescription className="text-slate-400">Créez votre compte propriétaire Welqo</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Nom complet *
                </Label>
                <Input
                  id="name"
                  placeholder="Entrez votre nom complet"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-white">
                  Numéro de téléphone *
                </Label>
                <div className="flex space-x-2">
                  <Select
                    value={formData.countryCode}
                    onValueChange={(value) => handleInputChange("countryCode", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-[100px] bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Code" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 text-white">
                      {countryCodes.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.code} {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="123456789"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    className="flex-1 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Mot de passe *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Entrez votre mot de passe (min. 8 caractères)"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 pr-10"
                    required
                    disabled={isLoading}
                    minLength={8}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">
                  Confirmer le mot de passe *
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmez votre mot de passe"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 pr-10"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-amber-400 text-slate-900 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                    <span>Création en cours...</span>
                  </div>
                ) : (
                  "Créer mon compte propriétaire"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-400">
                Déjà un compte propriétaire ?{" "}
                <Link href="/owner/login" className="text-amber-400 hover:text-amber-300">
                  Se connecter
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

