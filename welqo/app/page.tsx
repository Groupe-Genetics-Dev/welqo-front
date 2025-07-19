"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  QrCode,
  Shield,
  Users,
  Bell,
  ClipboardList,
  BarChart3,
  Smartphone,
  Building,
  UserCheck,
  Menu,
  X,
} from "lucide-react"
import { useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Float, Environment } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { CookieBanner } from "@/components/cookie-banner"
import { SessionManager } from "@/components/session-manager"
import { useSession } from "@/hooks/use-session"
import { useCookies } from "@/hooks/use-cookies"

// Composant QR Code animé
function AnimatedQRCode({ position }) {
  const groupRef = useRef()
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.5
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {Array.from({ length: 25 }).map((_, i) => {
        const x = (i % 5) - 2
        const z = Math.floor(i / 5) - 2
        const shouldShow = Math.random() > 0.3
        return shouldShow ? (
          <Float key={i} speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
            <mesh position={[x * 0.3, 0, z * 0.3]}>
              <boxGeometry args={[0.2, 0.2, 0.2]} />
              <meshStandardMaterial color="#082038" metalness={0.3} roughness={0.4} />
            </mesh>
          </Float>
        ) : null
      })}
    </group>
  )
}

// Composant Immeuble 3D
function Building3D({ position }) {
  const buildingRef = useRef()
  useFrame((state) => {
    if (buildingRef.current) {
      buildingRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={buildingRef} position={position}>
        <mesh position={[0, -1, 0]}>
          <boxGeometry args={[1.5, 2, 1.5]} />
          <meshStandardMaterial color="#082038" metalness={0.2} roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1.2, 1, 1.2]} />
          <meshStandardMaterial color="#082038" metalness={0.2} roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[1, 0.5, 1]} />
          <meshStandardMaterial color="#082038" metalness={0.3} roughness={0.7} />
        </mesh>
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh key={i} position={[0.6, -0.5 + (i % 3) * 0.5, 0.6 - Math.floor(i / 3) * 1.2]}>
            <boxGeometry args={[0.1, 0.2, 0.1]} />
            <meshStandardMaterial color="#efb83b" emissive="#efb83b" emissiveIntensity={0.3} />
          </mesh>
        ))}
      </group>
    </Float>
  )
}

// Composant Bouclier de sécurité
function SecurityShield({ position }) {
  const shieldRef = useRef()
  useFrame((state) => {
    if (shieldRef.current) {
      shieldRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.7) * 0.2
      shieldRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.1)
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={shieldRef} position={position}>
        <cylinderGeometry args={[0.8, 0.6, 0.2, 6]} />
        <meshStandardMaterial color="#082038" metalness={0.8} roughness={0.2} />
      </mesh>
    </Float>
  )
}

// Composant Notification flottante
function FloatingNotification({ position }) {
  const notifRef = useRef()
  useFrame((state) => {
    if (notifRef.current) {
      notifRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.8
      notifRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  return (
    <group ref={notifRef} position={position}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
        <mesh>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#efb83b" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="#efb83b" transparent opacity={0.3} />
        </mesh>
      </Float>
    </group>
  )
}

// Composant 3D Background
function Background3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 60 }}
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1 }}
    >
      <Environment preset="night" />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.6} color="#efb83b" />
      <pointLight position={[-10, -10, -5]} intensity={0.4} color="#082038" />
      <AnimatedQRCode position={[-8, 4, -6]} />
      <AnimatedQRCode position={[8, -2, -8]} />
      <AnimatedQRCode position={[0, 6, -10]} />
      <Building3D position={[-6, -4, -5]} />
      <Building3D position={[6, 2, -7]} />
      <SecurityShield position={[-10, 0, -8]} />
      <SecurityShield position={[10, -6, -6]} />
      <FloatingNotification position={[-4, 8, -4]} />
      <FloatingNotification position={[4, -8, -6]} />
      <FloatingNotification position={[0, 0, -12]} />
      {Array.from({ length: 15 }).map((_, i) => (
        <Float key={i} speed={1 + Math.random()} rotationIntensity={0.2} floatIntensity={1}>
          <mesh
            position={[(Math.random() - 0.5) * 25, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 20 - 10]}
            scale={0.05 + Math.random() * 0.1}
          >
            <octahedronGeometry args={[1]} />
            <meshStandardMaterial color="#efb83b" transparent opacity={0.7} />
          </mesh>
        </Float>
      ))}
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
    </Canvas>
  )
}

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const { session, createSession } = useSession()
  const { setCookie, preferences } = useCookies()

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["accueil", "fonctionnement", "fonctionnalites", "utilisateurs", "contact"]
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Suivre les pages visitées si les cookies analytiques sont acceptés
  useEffect(() => {
    if (preferences.analytics) {
      setCookie("page-visited", "homepage", 1)
      setCookie("visit-timestamp", Date.now().toString(), 1)
    }
  }, [preferences.analytics, setCookie])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)

    // Suivre les clics sur la navigation si les cookies analytiques sont acceptés
    if (preferences.analytics) {
      setCookie("last-navigation", sectionId, 1)
    }
  }

  const handleUserLogin = (userType: "resident" | "gardien" | "gestionnaire", href: string) => {
    // Créer une session temporaire pour suivre le type d'utilisateur
    if (preferences.necessary) {
      createSession({
        id: `temp-${Date.now()}`,
        role: userType,
      })
    }
    window.open(href, "_blank")
  }

  const navItems = [
    { id: "accueil", label: "Accueil" },
    { id: "fonctionnement", label: "Découverte" },
    { id: "fonctionnalites", label: "Fonctionnalités" },
    { id: "utilisateurs", label: "Nos Clients" },
    { id: "contact", label: "Contact" },
  ]

  return (
    <SessionManager>
      <div className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 w-full h-full">
          <Background3D />
          <div className="absolute inset-0 bg-gradient-to-br from-[#082038]/90 via-[#082038]/80 to-[#082038]/85 backdrop-blur-[1px]"></div>
        </div>

        <div className="fixed inset-0 opacity-15 pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 border-4 border-[#efb83b] rotate-45 animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border-2 border-[#efb83b] rotate-12 animate-bounce"></div>
          <div className="absolute bottom-32 left-1/3 w-40 h-40 border-8 border-[#efb83b] rotate-45 animate-spin-slow"></div>
          <div className="absolute top-1/2 right-1/4 w-28 h-28 border-4 border-[#efb83b] rotate-12 animate-pulse"></div>
          <div className="absolute top-1/4 left-1/4 grid grid-cols-3 gap-2 opacity-30">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 ${Math.random() > 0.5 ? "bg-[#efb83b]" : "bg-transparent"} animate-pulse`}
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
          <div className="absolute bottom-1/4 right-1/4 grid grid-cols-4 gap-1 opacity-20">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 ${Math.random() > 0.6 ? "bg-[#082038]" : "bg-transparent"} animate-pulse`}
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        </div>

        <header className="fixed top-0 left-0 right-0 z-50 border-b bg-white/95 backdrop-blur-md shadow-lg">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="relative">
                  <Image
                    src="/welqo-logo.png"
                    alt="Welqo Logo"
                    width={45}
                    height={45}
                    className="rounded-lg shadow-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#efb83b] to-[#082038] rounded-lg opacity-20 animate-pulse"></div>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-[#082038] to-[#efb83b] bg-clip-text text-transparent">
                    Welqo
                  </h1>
                  <span className="text-xs lg:text-sm text-[#efb83b] font-medium -mt-1">Genetics</span>
                </div>
              </div>

              <nav className="hidden lg:flex items-center space-x-8">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-sm font-medium transition-all duration-300 hover:text-[#efb83b] hover:scale-105 ${
                      activeSection === item.id ? "text-[#efb83b] font-semibold" : "text-gray-700"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              <Button
                className="hidden lg:flex bg-gradient-to-r from-[#082038] to-[#efb83b] hover:from-[#082038] hover:to-[#efb83b] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() => scrollToSection("utilisateurs")}
              >
                Commencer
              </Button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-md text-gray-700 hover:text-[#efb83b] hover:bg-gray-100 transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {isMenuOpen && (
              <div className="lg:hidden border-t bg-white/98 backdrop-blur-md">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        activeSection === item.id
                          ? "text-[#efb83b] bg-[#efb83b]/10"
                          : "text-gray-700 hover:text-[#efb83b] hover:bg-gray-50"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                  <div className="pt-2">
                    <Button
                      className="w-full bg-gradient-to-r from-[#082038] to-[#efb83b] hover:from-[#082038] hover:to-[#efb83b] text-white"
                      onClick={() => scrollToSection("utilisateurs")}
                    >
                      Commencer
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        <section
          id="accueil"
          className="relative z-10 pt-16 lg:pt-24 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 mt-20"
        >
          <div className="container mx-auto text-center max-w-4xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight drop-shadow-2xl">
              Simplifiez la gestion de votre résidence avec{" "}
              <span className="bg-gradient-to-r from-[#efb83b] to-[#efb83b] bg-clip-text text-transparent drop-shadow-lg animate-pulse font-extrabold">
                Welqo
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-100 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
              <span className="font-semibold text-[#efb83b]">Notre solution</span> est une solution numérique complète
              pour gérer les visiteurs, suivre les gardiens et améliorer la sécurité de votre bâtiment grâce aux QR
              codes intelligents.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <Button
                size="lg"
                className="bg-white/95 text-[#082038] hover:bg-white hover:scale-105 px-6 sm:px-8 text-sm sm:text-base shadow-xl transition-all duration-300 font-semibold"
                onClick={() => scrollToSection("fonctionnement")}
              >
                Découvrir
              </Button>
              <Button
                size="lg"
                className="bg-[#efb83b] text-white hover:bg-[#d4a730] hover:scale-105 px-6 sm:px-8 text-sm sm:text-base shadow-xl transition-all duration-300 font-semibold"
                onClick={() => {
                  if (preferences.analytics) {
                    setCookie("demo-download", "true", 1)
                  }
                  window.open("/demo.pdf", "_blank")
                }}
              >
                Télécharger la Démo
              </Button>
            </div>
          </div>
        </section>

        <section
          id="fonctionnement"
          className="relative z-10 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white/95 backdrop-blur-md"
        >
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12 sm:mb-16">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Comment{" "}
                <span className="bg-gradient-to-r from-[#082038] to-[#efb83b] bg-clip-text text-transparent font-extrabold">
                  Welqo
                </span>{" "}
                fonctionne ?
              </h3>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                Un processus simple en 4 étapes pour révolutionner la gestion de votre immeuble avec
                <span className="font-semibold text-[#efb83b]">notre solution</span>
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[
                {
                  icon: QrCode,
                  title: "1. Générer le QR Code",
                  description: "Le résident crée un QR code sécurisé pour son visiteur via l'application",
                },
                {
                  icon: Smartphone,
                  title: "2. Scanner à l'entrée",
                  description: "Le gardien scanne le QR code avec l'interface sur son smartphone",
                },
                {
                  icon: Shield,
                  title: "3. Validation automatique",
                  description: "Notre solution vérifie automatiquement les autorisations et valide ou refuse l'accès",
                },
                {
                  icon: BarChart3,
                  title: "4. Génération de rapports automatiques",
                  description: "Le syndic reçoit des rapports automatiques pour un suivi efficace",
                },
              ].map((step, index) => (
                <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#efb83b]/20 to-[#efb83b]/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg group-hover:shadow-xl transition-shadow border border-[#efb83b]/30">
                    <step.icon className="w-7 h-7 sm:w-8 sm:h-8 text-[#082038]" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-semibold mb-2">{step.title}</h4>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="fonctionnalites" className="relative z-10 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12 sm:mb-16">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 drop-shadow-lg">
                Les fonctionnalités
                <span className="bg-gradient-to-r from-[#efb83b] to-[#efb83b] bg-clip-text text-transparent font-extrabold">
                  Welqo
                </span>
              </h3>
              <p className="text-base sm:text-lg text-gray-100 drop-shadow-md">
                Découvrez tout ce que <span className="font-semibold text-[#efb83b]">notre solution</span> peut faire
                pour optimiser la gestion de votre résidence
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {[
                {
                  icon: QrCode,
                  title: "Gestion des Visiteurs",
                  description: "QR codes sécurisés pour un contrôle d'accès automatisé",
                },
                {
                  icon: UserCheck,
                  title: "Suivi des Gardiens",
                  description: "Pointage automatique et géolocalisation",
                },
                {
                  icon: ClipboardList,
                  title: "Signalement d'Incidents",
                  description: "Rapports en temps réel avec photos",
                },
                {
                  icon: Bell,
                  title: "Notifications",
                  description: "Alertes en temps réel pour tous les utilisateurs",
                },
                {
                  icon: BarChart3,
                  title: "Tableau de Bord",
                  description: "Statistiques et rapports détaillés",
                },
                {
                  icon: Building,
                  title: "Multi-Immeubles",
                  description: "Gérez plusieurs bâtiments depuis une interface unifiée",
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="border-[#efb83b]/30 bg-white/95 backdrop-blur-md hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white"
                >
                  <CardHeader className="pb-3 text-center">
                    <div className="flex justify-center mb-2">
                      <feature.icon className="w-8 h-8 sm:w-10 sm:h-10 text-[#082038] mx-auto" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-sm sm:text-base">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section
          id="utilisateurs"
          className="relative z-10 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white/95 backdrop-blur-md"
        >
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12 sm:mb-16">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                <span className="bg-gradient-to-r from-[#082038] to-[#efb83b] bg-clip-text text-transparent font-extrabold">
                  Welqo
                </span>{" "}
                pour tous les utilisateurs
              </h3>
              <p className="text-base sm:text-lg text-gray-600">
                Une interface <span className="font-semibold text-[#efb83b]">adaptée</span> à chaque profil
                d'utilisateur
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  icon: Shield,
                  title: "Gardiens",
                  description: "Interface simple et intuitive",
                  color: "[#082038]",
                  buttonText: "Accéder à l'interface Gardien",
                  href: "/gardiens/login",
                  userType: "gardien" as const,
                },
                {
                  icon: Users,
                  title: "Résidents",
                  description: "Contrôle total de vos visiteurs",
                  color: "[#efb83b]",
                  buttonText: "Accéder à l'espace Résident",
                  href: "/residents/login",
                  userType: "resident" as const,
                },
                {
                  icon: BarChart3,
                  title: "Gestionnaires",
                  description: "Vue d'ensemble et contrôle total",
                  color: "[#082038]",
                  buttonText: "Accéder au tableau de bord",
                  href: "/syndic/login",
                  userType: "gestionnaire" as const,
                },
              ].map((user, index) => (
                <Card
                  key={index}
                  className="text-center border-[#efb83b]/30 hover:shadow-2xl transition-all duration-300 flex flex-col hover:scale-105"
                >
                  <CardHeader className="flex-grow">
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-${user.color}/20 to-${user.color}/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg border border-${user.color}/30`}
                    >
                      <user.icon className={`w-7 h-7 sm:w-8 sm:h-8 text-${user.color}`} />
                    </div>
                    <CardTitle className={`text-lg sm:text-xl text-${user.color}`}>{user.title}</CardTitle>
                    <CardDescription className="text-sm sm:text-base">{user.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <Button
                      className={`w-full text-xs sm:text-sm py-2 sm:py-3 px-3 sm:px-4 bg-gradient-to-r from-${user.color} to-${user.color}/80 hover:from-${user.color}/90 hover:to-${user.color} text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl`}
                      onClick={() => handleUserLogin(user.userType, user.href)}
                    >
                      {user.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="relative z-10 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#082038]/95 to-[#082038]/95 backdrop-blur-sm"
        >
          <div className="container mx-auto text-center max-w-4xl">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 drop-shadow-lg">
              Prêt à moderniser votre immeuble avec{" "}
              <span className="bg-gradient-to-r from-[#efb83b] to-[#efb83b] bg-clip-text text-transparent font-extrabold">
                Welqo
              </span>{" "}
              ?
            </h3>
            <p className="text-lg sm:text-xl text-gray-100 mb-6 sm:mb-8 leading-relaxed drop-shadow-md">
              Rejoignez les gestionnaires qui ont déjà adopté{" "}
              <span className="font-semibold text-[#efb83b]">notre solution</span> pour simplifier leur quotidien
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <Button
                size="lg"
                className="bg-white text-[#082038] hover:bg-gray-50 hover:scale-105 px-6 sm:px-8 text-sm sm:text-base shadow-xl transition-all duration-300 font-semibold"
                onClick={() => {
                  if (preferences.analytics) {
                    setCookie("demo-request", "true", 1)
                  }
                }}
              >
                Demander une démo
              </Button>
              <Button
                size="lg"
                className="bg-white/20 text-white hover:bg-white/30 px-6 sm:px-8 text-sm sm:text-base shadow-xl transition-all duration-300 font-semibold border border-white"
                onClick={() => {
                  if (preferences.analytics) {
                    setCookie("contact-click", "true", 1)
                  }
                  window.open("https://groupegenetics.com/#contact", "_blank")
                }}
              >
                Contactez l'équipe
              </Button>
            </div>
          </div>
        </section>

        <footer className="relative z-10 bg-gray-900/95 backdrop-blur-md text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="sm:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <Image
                      src="/welqo-logo.png"
                      alt="Welqo Logo"
                      width={40}
                      height={40}
                      className="rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#efb83b] to-[#082038] rounded-lg opacity-20 animate-pulse"></div>
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#efb83b] to-[#efb83b] bg-clip-text text-transparent">
                      Welqo
                    </h4>
                    <span className="text-xs sm:text-sm text-[#efb83b] -mt-1">Genetics</span>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-gray-400 mb-4 leading-relaxed">
                  <span className="font-semibold text-[#efb83b]">Notre solution</span> est la solution complète pour la
                  gestion intelligente de vos immeubles avec QR codes.
                </p>
              </div>
              <div>
                <h5 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Fonctionnalités</h5>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                  <li>Gestion visiteurs</li>
                  <li>Suivi gardiens</li>
                  <li>Signalement incidents</li>
                  <li>Tableau de bord</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Support</h5>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                  <li>Documentation</li>
                  <li>Formation</li>
                  <li>Support technique</li>
                  <li>Contact</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-xs sm:text-sm text-center md:text-left">
                © 2025 <span className="font-semibold text-[#efb83b]">Welqo</span>. Tous droits réservés.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs sm:text-sm">Développé par</span>
                <Image
                  src="/placeholder.svg?height=25&width=25"
                  alt="Genetics Logo"
                  width={25}
                  height={25}
                  className="rounded"
                />
                <button
                  onClick={() => window.open("https://groupegenetics.com/", "_blank")}
                  className="text-gray-400 text-xs sm:text-sm hover:text-white"
                >
                  Genetics
                </button>
              </div>
            </div>
          </div>
        </footer>

        <CookieBanner />

        <style jsx global>{`
          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          .animate-spin-slow {
            animation: spin-slow 8s linear infinite;
          }
        `}</style>
      </div>
    </SessionManager>
  )
}

