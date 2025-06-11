import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, QrCode, Users, Clock } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900/95 via-blue-900/95 to-slate-800/95 backdrop-blur-sm border-b border-slate-700/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Image
                src="/welqo-logo.png"
                alt="Welqo Logo"
                width={50}
                height={50}
                className="rounded-lg w-10 h-10 sm:w-[50px] sm:h-[50px]"
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Welqo</h1>
                <p className="text-xs sm:text-sm text-amber-400">Genetics-Services</p>
              </div>
            </div>
            <div className="flex space-x-2 sm:space-x-4">
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-slate-900 text-xs sm:text-sm sm:px-4"
                >
                  Connexion
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-amber-400 text-slate-900 hover:bg-amber-500 text-xs sm:text-sm sm:px-4">
                  Inscription
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 pt-32">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Contrôle d'Accès
            <span className="block text-amber-400">Résidentiel</span>
            <span className="block text-2xl md:text-3xl text-amber-300 font-normal mt-2">avec Welqo</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Gérez facilement l'accès à votre résidence avec notre système de codes QR sécurisés. Générez des invitations
            temporaires et contrôlez qui entre dans votre bâtiment.
          </p>
          <div className="flex justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-amber-400 text-slate-900 hover:bg-amber-500 px-8 py-3 text-lg">
                Commencer Maintenant
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <QrCode className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Codes QR Sécurisés</h3>
              <p className="text-slate-300">Générez des codes QR temporaires pour vos invités</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Clock className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Accès Temporaire</h3>
              <p className="text-slate-300">Définissez la durée d'accès pour chaque visiteur</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Gestion Visiteurs</h3>
              <p className="text-slate-300">Suivez tous vos visiteurs en temps réel</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Shield className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Sécurité Maximale</h3>
              <p className="text-slate-300">Contrôle d'accès sécurisé avec validation</p>
            </CardContent>
          </Card>
        </div>

        {/* How it Works */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-white mb-12">Comment ça marche ?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-amber-400 text-slate-900 rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                1
              </div>
              <h4 className="text-xl font-semibold text-white">Créez un rendez-vous</h4>
              <p className="text-slate-300">Générez un code QR pour votre visiteur avec une durée d'accès définie</p>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 bg-amber-400 text-slate-900 rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                2
              </div>
              <h4 className="text-xl font-semibold text-white">Partagez le code</h4>
              <p className="text-slate-300">Envoyez le code QR à votre visiteur par message ou email</p>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 bg-amber-400 text-slate-900 rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                3
              </div>
              <h4 className="text-xl font-semibold text-white">Accès sécurisé</h4>
              <p className="text-slate-300">Le gardien scanne le code et valide l'accès automatiquement</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Image src="/welqo-logo.png" alt="Welqo Logo" width={40} height={40} className="rounded" />
              <div>
                <p className="text-white font-semibold">Welqo</p>
                <p className="text-sm text-amber-400">Genetics-Services</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm">© 2024 Welqo. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
