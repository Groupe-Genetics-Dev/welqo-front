import { jwtDecode } from 'jwt-decode';

export interface OwnerCreate {
  phone_number: string;
  password: string;
  name: string;
  email?: string;
}

export interface OwnerOut {
  id: string;
  phone_number: string;
  name: string;
  email?: string;
  logo_path?: string;
  created_at: string;
}

// Enum pour les types de rapports
export enum ReportType {
  USER_REPORT = "user_report",
  QR_CODE_REPORT = "qr_code_report",
  ACTIVITY_REPORT = "activity_report",
  SECURITY_REPORT = "security_report"
}


// Interface mise à jour pour la création de rapports
export interface ReportCreate {
  title: string;
  owner_id: string;
  report_type: ReportType;
  date_from?: string; // Format ISO string
  date_to?: string;   // Format ISO string
}

// Interface mise à jour pour la sortie des rapports
export interface ReportOut {
  id: string;
  title: string;
  file_path: string;
  report_type: ReportType;
  owner_id: string;
  created_at: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// Classe pour gérer les erreurs API
export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

export class OwnerApiClient {
  private static API_BASE_URL = "https://welqo-api.onrender.com/api/v1";

  // Fonction utilitaire pour gérer les réponses
  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Erreur inconnue' }));
      throw new APIError(response.status, errorData.detail || 'Erreur de l\'API');
    }
    return response.json();
  }

  // Fonction utilitaire pour obtenir les headers avec authentification
  private static getAuthHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Créer un nouveau propriétaire
  static async createOwner(ownerData: OwnerCreate): Promise<OwnerOut> {
    const response = await fetch(`${this.API_BASE_URL}/owners/create-owner`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(ownerData),
    });

    return this.handleResponse<OwnerOut>(response);
  }

  // Upload du logo pour le propriétaire connecté
  static async uploadLogo(file: File, token: string): Promise<OwnerOut> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.API_BASE_URL}/owners/upload-logo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    return this.handleResponse<OwnerOut>(response);
  }

  // Récupérer les rapports du propriétaire connecté
  static async getMyReports(token: string): Promise<ReportOut[]> {
    const response = await fetch(`${this.API_BASE_URL}/owners/my-reports`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<ReportOut[]>(response);
  }

  // Télécharger un rapport spécifique
  static async downloadReport(reportId: string, token: string): Promise<Blob> {
    const response = await fetch(`${this.API_BASE_URL}/owners/download/${reportId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Erreur inconnue' }));
      throw new APIError(response.status, errorData.detail || 'Erreur lors du téléchargement');
    }

    return response.blob();
  }

   static async forgotPassword(phoneNumber: string): Promise<{ message: string }> {
    const response = await fetch(`${this.API_BASE_URL}/owners/forgot-password`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ phone_number: phoneNumber }),
    });

    return this.handleResponse<{ message: string }>(response);
  }

  static async resetPassword(phoneNumber: string, newPassword: string, confirmPassword: string): Promise<{ message: string }> {
    const response = await fetch(`${this.API_BASE_URL}/owners/reset-password`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        phone_number: phoneNumber,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }),
    });

    return this.handleResponse<{ message: string }>(response);
  }
  

  // Créer un nouveau rapport avec type et filtres de date
  static async createReport(reportData: ReportCreate, token?: string): Promise<ReportOut> {
    const response = await fetch(`${this.API_BASE_URL}/reports/create-reports`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(reportData),
    });

    return this.handleResponse<ReportOut>(response);
  }

  // Connexion utilisateur
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await fetch(`${this.API_BASE_URL}/owner/login`, {
      method: 'POST',
      body: formData,
    });

    return this.handleResponse<AuthResponse>(response);
  }

  // Fonction pour télécharger un fichier depuis un Blob
  static downloadFileFromBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // Fonction pour valider un token JWT (version améliorée)
  static isTokenValid(token: string): boolean {
    if (!token) {
      console.log("Token validation: Aucun token fourni");
      return false;
    }

    try {
      // Vérifier le format du token JWT (3 parties séparées par des points)
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.log("Token validation: Format JWT invalide");
        return false;
      }

      // Décoder le payload
      const payload = JSON.parse(atob(parts[1]));
      console.log("Token payload:", {
        exp: payload.exp,
        iat: payload.iat,
        currentTime: Math.floor(Date.now() / 1000)
      });

      // Vérifier l'expiration
      const currentTime = Math.floor(Date.now() / 1000);
      const isNotExpired = payload.exp > currentTime;
      
      console.log("Token validation result:", isNotExpired);
      
      if (!isNotExpired) {
        console.log("Token expiré");
      }
      
      return isNotExpired;
    } catch (error) {
      console.error("Erreur lors de la validation du token:", error);
      return false;
    }
  }

  static getTokenInfo(token: string): { userId: string } | null {
    try {
      const decoded: any = jwtDecode(token);
      console.log("Contenu décodé du token :", decoded);

      const userId = decoded.owner_id || decoded.userId || decoded.sub || decoded.id;
      if (!userId) {
        console.warn("userId manquant dans le token");
        return null;
      }

      return { userId };
    } catch (error) {
      console.error("Erreur de décodage du token:", error);
      return null;
    }
  }

  // Supprimer un rapport spécifique
  static async deleteReport(reportId: string, token: string): Promise<void> {
    const response = await fetch(`${this.API_BASE_URL}/reports/delete-report/${reportId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(token),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Erreur inconnue' }));
      throw new APIError(response.status, errorData.detail || 'Erreur lors de la suppression du rapport');
    }

    return response.json();
  }

  // Fonction utilitaire pour obtenir les options de types de rapports
  static getReportTypeOptions(): { value: ReportType; label: string; description: string; icon: string }[] {
    return [
      {
        value: ReportType.USER_REPORT,
        label: "Rapport Utilisateur",
        description: "Analyse des visiteurs et de leurs accès",
        icon: "Users"
      },
      {
        value: ReportType.QR_CODE_REPORT,
        label: "Rapport Code QR",
        description: "Statistiques sur l'utilisation des codes QR",
        icon: "QrCode"
      },
      {
        value: ReportType.ACTIVITY_REPORT,
        label: "Rapport d'Activité",
        description: "Vue globale des activités sur la plateforme",
        icon: "Activity"
      },
      {
        value: ReportType.SECURITY_REPORT,
        label: "Rapport de Sécurité",
        description: "Analyse de sécurité et détection d'anomalies",
        icon: "Shield"
      }
    ];
  }

  // Fonction utilitaire pour obtenir l'icône du type de rapport
  static getReportTypeIcon(reportType: ReportType): string {
    const typeMap = {
      [ReportType.USER_REPORT]: "Users",
      [ReportType.QR_CODE_REPORT]: "QrCode",
      [ReportType.ACTIVITY_REPORT]: "Activity",
      [ReportType.SECURITY_REPORT]: "Shield"
    };
    return typeMap[reportType] || "FileText";
  }

  // Fonction utilitaire pour obtenir la couleur du type de rapport
  static getReportTypeColor(reportType: ReportType): string {
    const colorMap = {
      [ReportType.USER_REPORT]: "text-blue-400",
      [ReportType.QR_CODE_REPORT]: "text-green-400",
      [ReportType.ACTIVITY_REPORT]: "text-amber-400",
      [ReportType.SECURITY_REPORT]: "text-red-400"
    };
    return colorMap[reportType] || "text-slate-400";
  }

static async getStatistics(token?: string): Promise<{
    total_users: number;
    total_qr_codes: number;
    active_qr_codes: number;
    total_scans: number;
    users_this_month: number;
    qr_codes_this_month: number;
}> {  
  const response = await fetch(`${this.API_BASE_URL}/reports/statistics`, {
    method: 'GET',
    headers: this.getAuthHeaders(token),
  });

  return this.handleResponse<{
    total_users: number;
    total_qr_codes: number;
    active_qr_codes: number;
    total_scans: number;
    users_this_month: number;
    qr_codes_this_month: number;
  }>(response);
}

}

