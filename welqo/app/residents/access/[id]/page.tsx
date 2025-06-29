"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Download, Calendar, Clock, User, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import QRCode from "qrcode";
import { apiClient } from "@/lib/api";

interface AccessData {
  id: string;
  name: string;
  visitorPhone: string;
  createdBy: string;
  createdByPhone: string;
  apartment: string;
  expiresAt: string;
  createdAt: string;
  status: "active" | "expired" | "used";
}

async function getAccessInfo(formId: string) {
  try {
    const response = await apiClient.getPublicForm(formId);
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data;
  } catch (err) {
    console.error("Erreur lors de la récupération des données:", err);
    throw new Error("Ce code d'accès est invalide ou a expiré");
  }
}

async function shareQRAccess(formId: string, accessData: AccessData) {
  const baseUrl = window.location.origin;
  const shareUrl = `${baseUrl}/access/${formId}?shared=true`;

  if (new Date(accessData.expiresAt) < new Date()) {
    alert("Ce code d'accès a expiré et ne peut pas être partagé.");
    return false;
  }

  const shareMessage = `Code d'accès pour ${accessData.name}`;
  const expiryDate = new Date(accessData.expiresAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const shareText = `Voici votre code d'accès Welqo. Valide jusqu'au ${expiryDate}`;

  try {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareMessage,
          text: shareText,
          url: shareUrl,
        });
        return true;
      } catch (shareError) {
        if (shareError instanceof Error && shareError.name !== "AbortError") {
          console.error("Erreur lors du partage natif:", shareError);
        }
      }
    }

    await navigator.clipboard.writeText(shareUrl);
    alert(`Le lien de votre code d'accès a été copié !\n\n${shareText}\n\nLien: ${shareUrl}`);
    return true;
  } catch (error) {
    console.error("Erreur lors du partage:", error);
    alert("Erreur lors du partage du code d'accès.");
    return false;
  }
}

function AccessPage() {
  const params = useParams();
  const id = params?.id as string;
  const [isShared, setIsShared] = useState(false);
  const [accessData, setAccessData] = useState<AccessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [src, setSrc] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      setIsShared(searchParams.get('shared') === 'true');
    }
  }, []);

  useEffect(() => {
    if (isShared && typeof window !== "undefined") {
      localStorage.setItem(`shared-${id}`, 'true');
    }
  }, [isShared, id]);

  const generate = () => {
    if (accessData) {
      // FIX: Générer un QR code avec les informations structurées au lieu de juste l'ID
      const qrData = JSON.stringify({
        id: id,
        type: "welqo_access",
        visitor: {
          name: accessData.name,
          phone: accessData.visitorPhone
        },
        resident: {
          name: accessData.createdBy,
          phone: accessData.createdByPhone,
          apartment: accessData.apartment
        },
        created_at: accessData.createdAt,
        expires_at: accessData.expiresAt,
        timestamp: new Date().toISOString()
      });

      QRCode.toDataURL(qrData, {
        errorCorrectionLevel: "H",
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      .then((url) => setSrc(url))
      .catch((err) => {
        console.error("Erreur lors de la génération du QR code:", err);
        setError("Impossible de générer le QR code");
      });
    }
  };

  const generateDisplayInfo = () => {
    if (accessData) {
      return `
        Visiteur: ${accessData.name}
        Tél: ${accessData.visitorPhone}
        Résident: ${accessData.createdBy}
        Appartement: ${accessData.apartment}
        Expire: ${formatDate(accessData.expiresAt)}
      `.trim();
    }
    return "";
  };

  const sharePage = async () => {
    if (accessData) {
      await shareQRAccess(id, accessData);
    }
  };

  const fetchAccessData = async () => {
    try {
      const data = await getAccessInfo(id);
      if (data) {
        setAccessData({
          id: data.id,
          name: data.name,
          visitorPhone: data.phone_number,
          createdBy: data.user.name,
          createdByPhone: data.user.phone_number,
          apartment: data.user.appartement,
          expiresAt: data.expires_at,
          createdAt: data.created_at,
          status: new Date(data.expires_at) < new Date() ? "expired" : "active",
        });
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des données:", err);
      setError("Ce code d'accès est invalide ou a expiré");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAccessData();
    }
  }, [id]);

  useEffect(() => {
    if (accessData) {
      generate();
    }
  }, [accessData]);

  const handleDownload = () => {
    if (!src) return;
    const link = document.createElement("a");
    link.href = src;
    link.download = `welqo-access-${id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white text-lg">Chargement du code d'accès...</p>
        </div>
      </div>
    );
  }

  if (error || !accessData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <Image
                src="/logo-alt.jpeg"
                alt="Welqo Logo"
                width={60}
                height={60}
                className="rounded-lg"
              />
            </div>
            <CardTitle className="text-2xl text-white text-center">
              Accès non disponible
            </CardTitle>
            <CardDescription className="text-slate-400 text-center">
              {error || "Ce code d'accès est invalide ou a expiré"}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center pt-2">
            <Link href="/">
              <Button className="bg-amber-400 text-slate-900 hover:bg-amber-500">
                Retour à l'accueil
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const expired = isExpired(accessData.expiresAt);
  const isSharedAccess = typeof window !== "undefined" && localStorage.getItem(`shared-${id}`) === 'true';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <Image
              src="/logo-alt.jpeg"
              alt="Welqo Logo"
              width={60}
              height={60}
              className="rounded-lg"
            />
          </div>
          <CardTitle className="text-2xl text-white text-center">
            Code d'accès
          </CardTitle>
          <CardDescription className="text-slate-400 text-center">
            {expired ? "Ce code d'accès a expiré" : "Présentez ce code QR au gardien à votre arrivée"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {src && (
            <div className="flex justify-center">
              <div className={`bg-white p-4 rounded-lg ${expired ? "opacity-50" : ""}`}>
                <Image src={src} alt="QR Code" width={200} height={200} />
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <div className={`px-4 py-2 rounded-full ${expired ? "bg-red-500/20 text-red-300" : "bg-blue-500/20 text-blue-300"}`}>
              {expired ? "Expiré" : "Actif"}
            </div>
          </div>

          <div className="bg-slate-700/50 p-4 rounded-lg space-y-3">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-sm text-slate-400">Visiteur</p>
                <p className="text-white">{accessData.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-sm text-slate-400">Date de création</p>
                <p className="text-white">{formatDate(accessData.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-sm text-slate-400">Expire le</p>
                <p className={expired ? "text-red-300" : "text-white"}>
                  {formatDate(accessData.expiresAt)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center space-x-2 pt-2">
          <Button
            onClick={handleDownload}
            className="bg-amber-400 text-slate-900 hover:bg-amber-500"
            disabled={expired}
          >
            <Download className="w-4 h-4 mr-2" />
            Télécharger
          </Button>

          {!isSharedAccess && (
            <Button
              onClick={sharePage}
              className="bg-blue-500 text-white hover:bg-blue-600"
              disabled={expired}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Partager
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default AccessPage;


