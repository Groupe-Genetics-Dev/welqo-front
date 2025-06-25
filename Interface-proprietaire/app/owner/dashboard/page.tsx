"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {
  LogOut,
  Building,
  Users,
  QrCode,
  Activity,
  Download,
  FileText,
  BarChart3,
  Shield,
  TrendingUp,
  AlertTriangle,
  Loader2,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { OwnerApiClient, ReportOut, ReportType } from "@/lib/owner-api";

interface SystemStats {
  total_users: number;
  total_qr_codes: number;
  active_qr_codes: number;
  total_scans: number;
  users_this_month: number;
  qr_codes_this_month: number;
}

export default function OwnerDashboardPage() {
  const router = useRouter();
  const [ownerName, setOwnerName] = useState<string>("Propriétaire");
  const [token, setToken] = useState<string>("");
  const [reports, setReports] = useState<ReportOut[]>([]);
  const [stats, setStats] = useState<SystemStats>({
    total_users: 0,
    total_qr_codes: 0,
    active_qr_codes: 0,
    total_scans: 0,
    users_this_month: 0,
    qr_codes_this_month: 0,
  });
  const [reportFilters, setReportFilters] = useState({
    type: ReportType.USER_REPORT,
    format: "pdf",
    startDate: "",
    endDate: "",
  });
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      const errorTimer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(errorTimer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const successTimer = setTimeout(() => {
        setSuccess("");
      }, 3000);
      return () => clearTimeout(successTimer);
    }
  }, [success]);

  useEffect(() => {
    const storedToken = localStorage.getItem("owner_token");
    if (!storedToken) {
      router.push("/owner/login");
      return;
    }

    const isValid = OwnerApiClient.isTokenValid(storedToken);
    if (!isValid) {
      localStorage.removeItem("owner_token");
      router.push("/owner/login");
      return;
    }

    setToken(storedToken);
    loadOwnerReports(storedToken);
    loadSystemStats();
  }, [router]);

  const loadSystemStats = async () => {
    try {
      const statsData = await OwnerApiClient.getStatistics(token);
      setStats({
        total_users: statsData.total_users,
        total_qr_codes: statsData.total_qr_codes,
        active_qr_codes: statsData.active_qr_codes,
        total_scans: statsData.total_scans,
        users_this_month: statsData.users_this_month,
        qr_codes_this_month: statsData.qr_codes_this_month,
      });
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
      setError("Impossible de charger les statistiques");
    }
  };

  const loadOwnerReports = async (authToken: string) => {
    setIsLoadingReports(true);
    setError("");

    try {
      const ownerReports = await OwnerApiClient.getMyReports(authToken);
      setReports(ownerReports);
    } catch (err) {
      console.error("Erreur lors du chargement des rapports:", err);
      setError(
        "Impossible de charger les rapports: " +
          (err && typeof err === "object" && "message" in err
            ? err.message
            : "Erreur inconnue")
      );
    } finally {
      setIsLoadingReports(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("owner_token");
    router.push("/owner/login");
  };

  const generateReport = async () => {
    if (!reportFilters.startDate || !reportFilters.endDate) {
      setError("Veuillez sélectionner une période");
      return;
    }

    if (!token) {
      setError("Token d'authentification manquant");
      return;
    }

    setIsGeneratingReport(true);
    setError("");
    setSuccess("");

    try {
      const tokenInfo = OwnerApiClient.getTokenInfo(token);
      if (!tokenInfo || !tokenInfo.userId) {
        throw new Error("Impossible de récupérer l'ID du propriétaire");
      }

      const reportTitle = `${reportFilters.type} - ${reportFilters.startDate} à ${reportFilters.endDate}`;

      const newReport = await OwnerApiClient.createReport(
        {
          title: reportTitle,
          owner_id: tokenInfo.userId,
          report_type: reportFilters.type,
          date_from: reportFilters.startDate ? new Date(reportFilters.startDate).toISOString() : undefined,
          date_to: reportFilters.endDate ? new Date(reportFilters.endDate).toISOString() : undefined,
        },
        token
      );

      setSuccess("Rapport généré avec succès !");
      await loadOwnerReports(token);
    } catch (err) {
      console.error("Erreur lors de la génération du rapport:", err);
      setError(
        err && typeof err === "object" && "message" in err
          ? String((err as { message?: string }).message)
          : "Erreur lors de la génération du rapport"
      );
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const downloadReport = async (reportId: string) => {
    if (!token) {
      setError("Token d'authentification manquant");
      return;
    }

    try {
      const blob = await OwnerApiClient.downloadReport(reportId, token);
      const report = reports.find(r => r.id === reportId);
      const filename = report ? `${report.title}.${reportFilters.format}` : `rapport-${reportId}.${reportFilters.format}`;

      OwnerApiClient.downloadFileFromBlob(blob, filename);
      setSuccess("Rapport téléchargé avec succès !");
    } catch (err) {
      console.error("Erreur lors du téléchargement:", err);
      setError(
        err && typeof err === "object" && "message" in err
          ? String((err as { message?: string }).message)
          : "Erreur lors du téléchargement"
      );
    }
  };

  const confirmDeleteReport = (reportId: string) => {
    setReportToDelete(reportId);
  };

  const deleteReport = async () => {
    if (!token || !reportToDelete) {
      setError("Token d'authentification manquant ou rapport non spécifié");
      return;
    }

    try {
      await OwnerApiClient.deleteReport(reportToDelete, token);
      setSuccess("Rapport supprimé avec succès !");
      setReportToDelete(null);
      await loadOwnerReports(token);
    } catch (err) {
      console.error("Erreur lors de la suppression du rapport:", err);
      setError(
        err && typeof err === "object" && "message" in err
          ? String((err as { message?: string }).message)
          : "Erreur lors de la suppression du rapport"
      );
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fr-FR").format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getReportIcon = (reportType: ReportType) => {
    const iconName = OwnerApiClient.getReportTypeIcon(reportType);
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      Users,
      QrCode,
      Activity,
      Shield,
      FileText
    };
    const IconComponent = iconMap[iconName] || FileText;
    return <IconComponent className="w-4 h-4" />;
  };

  const getReportTypeDescription = (reportType: ReportType) => {
    const descriptions = {
      [ReportType.USER_REPORT]: "Analyse des visiteurs et de leurs accès",
      [ReportType.QR_CODE_REPORT]: "Statistiques sur l'utilisation des codes QR",
      [ReportType.ACTIVITY_REPORT]: "Vue globale des activités sur la plateforme",
      [ReportType.SECURITY_REPORT]: "Analyse de sécurité et détection d'anomalies"
    };
    return descriptions[reportType] || "Rapport personnalisé";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Image
                src="/logo-alt.jpeg"
                alt="Welqo Logo"
                width={40}
                height={40}
                className="rounded-lg w-8 h-8 sm:w-10 sm:h-10"
              />
              <Building className="w-6 h-6 text-amber-400" />
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">Espace Propriétaire</h1>
                <p className="text-xs sm:text-sm text-slate-400">Bienvenue, {ownerName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-slate-400 hover:text-white"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Tableau de Bord Propriétaire 🏢</h2>
          <p className="text-slate-300">Gérez votre plateforme et générez des rapports détaillés.</p>
        </div>

        {error && (
          <Alert className="mb-6 bg-red-500/20 border-red-500/50 text-red-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-500/20 border-green-500/50 text-green-200">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Utilisateurs Total</CardTitle>
              <Users className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatNumber(stats.total_users)}</div>
              <p className="text-xs text-green-400">+{stats.users_this_month} ce mois</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Codes QR Générés</CardTitle>
              <QrCode className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatNumber(stats.total_qr_codes)}</div>
              <p className="text-xs text-green-400">+{stats.qr_codes_this_month} ce mois</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Codes QR Actifs</CardTitle>
              <Activity className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{formatNumber(stats.active_qr_codes)}</div>
              <p className="text-xs text-slate-400">En cours d'utilisation</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Scans Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatNumber(stats.total_scans)}</div>
              <p className="text-xs text-slate-400">Validations effectuées</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span>Génération de Rapports</span>
              </CardTitle>
              <CardDescription className="text-slate-400">
                Générez et téléchargez des rapports détaillés selon vos besoins
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Type de rapport</Label>
                  <Select
                    value={reportFilters.type}
                    onValueChange={(value) => setReportFilters({ ...reportFilters, type: value as ReportType })}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {OwnerApiClient.getReportTypeOptions().map((option) => (
                        <SelectItem key={option.value} value={option.value} className="text-white">
                          <div className="flex items-center space-x-2">
                            {getReportIcon(option.value)}
                            <div>
                              <div className="font-medium">{option.label}</div>
                              <div className="text-xs text-slate-400">{option.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-400">
                    {getReportTypeDescription(reportFilters.type)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Format</Label>
                  <Select
                    value={reportFilters.format}
                    onValueChange={(value) => setReportFilters({ ...reportFilters, format: value as "pdf" | "excel" })}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="pdf" className="text-white">
                        PDF
                      </SelectItem>
                      <SelectItem value="excel" className="text-white">
                        Excel
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Date de début</Label>
                    <Input
                      type="date"
                      value={reportFilters.startDate}
                      onChange={(e) => setReportFilters({ ...reportFilters, startDate: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Date de fin</Label>
                    <Input
                      type="date"
                      value={reportFilters.endDate}
                      onChange={(e) => setReportFilters({ ...reportFilters, endDate: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={generateReport}
                className="w-full bg-amber-400 text-slate-900 hover:bg-amber-500"
                disabled={isGeneratingReport || !reportFilters.startDate || !reportFilters.endDate}
              >
                {isGeneratingReport ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Générer et Télécharger
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-amber-400" />
                <span>Mes Rapports</span>
                {isLoadingReports && <Loader2 className="w-4 h-4 animate-spin" />}
              </CardTitle>
              <CardDescription className="text-slate-400">
                Liste de vos rapports générés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {reports.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun rapport généré</p>
                    <p className="text-sm">Générez votre premier rapport ci-contre</p>
                  </div>
                ) : (
                  reports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">{report.title}</h4>
                        <p className="text-slate-400 text-sm">
                          Créé le {formatDate(report.created_at)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          onClick={() => downloadReport(report.id)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          onClick={() => confirmDeleteReport(report.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <AlertDialog
        open={!!reportToDelete}
        onOpenChange={(isOpen: boolean) => !isOpen && setReportToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce rapport ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement le rapport.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={deleteReport}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

