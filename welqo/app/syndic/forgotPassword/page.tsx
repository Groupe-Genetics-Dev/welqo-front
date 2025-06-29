"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { OwnerApiClient } from "@/lib/owner-api";

export default function ForgotPasswordPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState(1); 
  const router = useRouter();

  const handleForgotPassword = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await OwnerApiClient.forgotPassword(phoneNumber);
      setSuccess(response.message);
      setStep(2);
    } catch (error) {
      if (error && typeof error === "object" && "message" in error) {
        setError((error as { message: string }).message || "Une erreur est survenue");
      } else {
        setError("Une erreur est survenue");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await OwnerApiClient.resetPassword(phoneNumber, newPassword, confirmPassword);
      setSuccess(response.message);
      setTimeout(() => {
        router.push("/syndic/login");
      }, 2000);
    } catch (error) {
      if (error && typeof error === "object" && "message" in error) {
        setError((error as { message?: string }).message || "Une erreur est survenue");
      } else {
        setError("Une erreur est survenue");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <div className="flex items-center space-x-2">
              <Link href="/syndic/login">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <CardTitle className="text-2xl text-white">Mot de passe oublié</CardTitle>
            </div>
            <CardDescription className="text-slate-400">
              {step === 1 ? "Saisissez votre numéro de téléphone" : "Saisissez votre nouveau mot de passe"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4 bg-red-500/20 border-red-500/50 text-red-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4 bg-green-500/20 border-green-500/50 text-green-200">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {step === 1 ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-white">
                    Numéro de téléphone
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="123456789"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    required
                    disabled={isLoading}
                  />
                </div>

                <Button
                  onClick={handleForgotPassword}
                  className="w-full bg-amber-400 text-slate-900 hover:bg-amber-500 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Vérification en cours..." : "Vérifier le numéro"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-white">
                    Nouveau mot de passe
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Nouveau mot de passe"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white">
                    Confirmer le mot de passe
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    required
                    disabled={isLoading}
                  />
                </div>

                <Button
                  onClick={handleResetPassword}
                  className="w-full bg-amber-400 text-slate-900 hover:bg-amber-500 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Réinitialisation en cours..." : "Réinitialiser le mot de passe"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

