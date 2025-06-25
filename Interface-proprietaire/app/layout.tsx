import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ToastContainer } from "@/components/toast-container"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Welqo - Contrôle d'Accès Résidentiel",
  description: "Système de gestion de contrôle d'accès résidentiel avec codes QR",
    generator: 'Korka.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>

            {children}
            <ToastContainer />
      </body>
    </html>
  )
}
