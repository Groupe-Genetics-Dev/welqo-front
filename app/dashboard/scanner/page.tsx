"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, QrCode, CheckCircle, XCircle, Camera } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ScanResult {
  valid: boolean
  message: string
  data?: {
    name: string
    phone: string
    createdAt: string
    expiresAt: string
  }
}

export default function ScannerPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)

  const simulateScan = () => {
    setIsScanning(true)

    // Simulation de scan
    setTimeout(() => {
      const mockResult: ScanResult = {
        valid: true,
        message: "QR code valide",
        data: {
          name: "Marie Dubois",
          phone: "+33 6 12 34 56 78",
          createdAt: "2024-01-15T10:30:00",
          expiresAt: "2024-01-15T18:30:00",
        },
      }
      setScanResult(mockResult)
      setIsScanning(false)
    }, 2000)
  }

  const resetScanner = () => {
    setScanResult(null)
    setIsScanning(false)
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
              <h1 className="text-lg sm:text-xl font-bold text-white">Scanner QR</h1>
              <p className="text-xs sm:text-sm text-slate-400">Validation des codes d'accès</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {!scanResult ? (
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-white">Scanner un code QR</CardTitle>
                <CardDescription className="text-slate-400">
                  Pointez la caméra vers le code QR du visiteur
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="relative">
                  <div className="w-64 h-64 mx-auto bg-slate-700 rounded-lg border-2 border-dashed border-slate-600 flex items-center justify-center">
                    {isScanning ? (
                      <div className="text-center">
                        <div className="animate-spin w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-slate-400">Scan en cours...</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Camera className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-400">Zone de scan</p>
                      </div>
                    )}
                  </div>

                  {/* Overlay de scan */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-full border-2 border-amber-400 rounded-lg opacity-50"></div>
                    <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-400"></div>
                    <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-400"></div>
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-400"></div>
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-400"></div>
                  </div>
                </div>

                <Button
                  onClick={simulateScan}
                  disabled={isScanning}
                  className="w-full bg-amber-400 text-slate-900 hover:bg-amber-500"
                >
                  {isScanning ? (
                    "Scan en cours..."
                  ) : (
                    <>
                      <QrCode className="w-4 h-4 mr-2" />
                      Démarrer le scan
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  {scanResult.valid ? (
                    <CheckCircle className="w-16 h-16 text-green-500" />
                  ) : (
                    <XCircle className="w-16 h-16 text-red-500" />
                  )}
                </div>
                <CardTitle className="text-white">{scanResult.valid ? "Accès Autorisé" : "Accès Refusé"}</CardTitle>
                <CardDescription className="text-slate-400">{scanResult.message}</CardDescription>
              </CardHeader>

              {scanResult.valid && scanResult.data && (
                <CardContent className="space-y-4">
                  <div className="bg-slate-700/50 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Visiteur:</span>
                      <span className="text-white font-semibold">{scanResult.data.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Téléphone:</span>
                      <span className="text-white">{scanResult.data.phone}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Expire à:</span>
                      <span className="text-white">{new Date(scanResult.data.expiresAt).toLocaleString("fr-FR")}</span>
                    </div>
                    <div className="flex justify-center pt-2">
                      <Badge className="bg-green-500 text-white">Accès Valide</Badge>
                    </div>
                  </div>

                  <div className="text-center text-sm text-slate-400">
                    Accès enregistré le {new Date().toLocaleString("fr-FR")}
                  </div>
                </CardContent>
              )}

              <CardContent className="pt-0">
                <Button onClick={resetScanner} className="w-full bg-amber-400 text-slate-900 hover:bg-amber-500">
                  Scanner un autre code
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
