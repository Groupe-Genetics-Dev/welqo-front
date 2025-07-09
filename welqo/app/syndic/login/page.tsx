"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Building, ArrowLeft, AlertTriangle, CheckCircle } from "lucide-react";
import Image from "next/image";
import { OwnerApiClient } from "@/lib/owner-api";

export default function OwnerLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    countryCode: "+221",
    phoneNumber: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const countryCodes = [

    { code: "+221", name: "Senegal", flag: "🇸🇳" },
  ];

  useEffect(() => {
    const existingToken = localStorage.getItem("owner_token");
    if (existingToken && OwnerApiClient.isTokenValid(existingToken)) {
      console.log("Token valide trouvé, redirection vers dashboard");
      router.push("/syndic/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.phoneNumber || !formData.password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);

    try {
      const credentials = {
        username: `${formData.countryCode}${formData.phoneNumber}`,
        password: formData.password,
      };

      console.log("Tentative de connexion avec:", credentials.username);
      const result = await OwnerApiClient.login(credentials);
      console.log("Réponse de l'API:", result);

      if (result.access_token) {
        localStorage.setItem("owner_token", result.access_token);
        console.log("Token sauvegardé:", result.access_token.substring(0, 20) + "...");

        const tokenInfo = OwnerApiClient.getTokenInfo(result.access_token);
        if (tokenInfo) {
          localStorage.setItem(
            "owner_username",
            tokenInfo.username || tokenInfo.userId || credentials.username
          );
          console.log("Informations du token:", tokenInfo);
        }

        setShowSuccessMessage(true);

        setTimeout(() => {
          setShowSuccessMessage(false);
          console.log("Redirection vers le dashboard...");
          router.push("/syndic/dashboard");
        }, 1500);
      } else {
        console.error("Aucun token reçu dans la réponse");
        setError("Erreur de connexion: aucun token reçu");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);

      if (error.status === 401) {
        setError("Numéro de téléphone ou mot de passe incorrect");
      } else if (error.status === 422) {
        setError("Numéro de téléphone invalide ou mot de passe incorrect");
      } else if (error.status === 500) {
        setError("Numéro de téléphone invalide ou mot de passe incorrect");
      } else {
        setError(error.message || "Une erreur inattendue est survenue");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) {
      setError("");
    }
  };

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
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
                onClick={() => router.push("/")}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <CardTitle className="text-2xl text-white">Connexion</CardTitle>
            </div>
            <CardDescription className="text-slate-400">
              Connectez-vous à votre espace propriétaire
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showSuccessMessage && (
              <Alert className="mb-4 bg-green-500/20 border-green-500/50 text-green-200">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Connexion réussie ! Redirection en cours...
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert className="mb-4 bg-red-500/20 border-red-500/50 text-red-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-white">
                  Numéro de téléphone
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
                          <span className="flex items-center space-x-2">
                            <span>{country.flag}</span>
                            <span>{country.code}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Entrer votre numéro de téléphone"
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
                  Mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Entrez votre mot de passe"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 pr-10"
                    required
                    disabled={isLoading}
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

              <Button
                type="submit"
                className="w-full bg-amber-400 text-slate-900 hover:bg-amber-500 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-400">
                Besoin d'aide ? Contactez l'équipe Welqo.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
