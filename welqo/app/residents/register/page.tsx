"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const countryCodeOptions = [
  { code: "+221", country: "Sénégal", flag: "🇸🇳" },
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    countryCode: "+221",
    phone_number: "",
    appartement: "",
    password: "",
    confirmPassword: "",
    resident: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const fullPhoneNumber = formData.countryCode + formData.phone_number;

    if (formData.password !== formData.confirmPassword) {
      const message = "Les mots de passe ne correspondent pas";
      setErrorMessage(message);
      showToast(message, "error");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (formData.password.length < 6) {
      const message = "Le mot de passe doit contenir au moins 6 caractères";
      setErrorMessage(message);
      showToast(message, "error");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!formData.phone_number.match(/^[0-9]{8,12}$/)) {
      const message = "Veuillez entrer un numéro de téléphone valide";
      setErrorMessage(message);
      showToast(message, "error");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (formData.resident !== "welqo") {
      const message = "Le code résident est invalide. Veuillez entrer un code resident valide.";
      setErrorMessage(message);
      showToast(message, "error");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }


    setIsLoading(true);

    try {
      const response = await apiClient.register({
        name: formData.name,
        phone_number: fullPhoneNumber,
        appartement: formData.appartement,
        password: formData.password,
        resident: formData.resident,
      });

      if (response.error) {
        setErrorMessage(response.error);
        showToast(response.error, "error");
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const message = "Inscription réussie ! Vous pouvez maintenant vous connecter.";
        setSuccessMessage(message);
        showToast(message, "success");
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
          router.push("/residents/login");
        }, 3000);
      }
    } catch (error) {
      const message = "Une erreur inattendue est survenue";
      setErrorMessage(message);
      showToast(message, "error");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      {errorMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
          <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage("")}
              className="ml-4 text-white hover:text-red-200 flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
          <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage("")}
              className="ml-4 text-white hover:text-green-200 flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-md">
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
              <Link href="/residents/login">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <CardTitle className="text-2xl text-white">Inscription</CardTitle>
            </div>
            <CardDescription className="text-slate-400">Créez votre compte Welqo</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Nom complet
                </Label>
                <Input
                  id="name"
                  placeholder="Entrez votre nom complet"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number" className="text-white">
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
                    id="phone_number"
                    type="tel"
                    placeholder="Entrez votre numéro de téléphone"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value.replace(/[^0-9]/g, "") })}
                    className="flex-1 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="resident" className="text-white">
                  Code résident
                </Label>
                <Input
                  id="resident"
                  placeholder="Entrer votre code résident"
                  value={formData.resident}
                  onChange={(e) => setFormData({ ...formData, resident: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="appartement" className="text-white">
                  Appartement
                </Label>
                <Input
                  id="appartement"
                  placeholder="Entrez votre numéro d'appartement"
                  value={formData.appartement}
                  onChange={(e) => setFormData({ ...formData, appartement: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Entrez votre mot de passe"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                <Label htmlFor="confirmPassword" className="text-white">
                  Confirmer le mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmez votre mot de passe"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
                {isLoading ? "Création..." : "Créer mon compte"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-400">
                Déjà un compte ?{" "}
                <Link href="/residents/login" className="text-amber-400 hover:text-amber-300">
                  Se connecter
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

