const API_BASE_URL =  "http://192.168.218.1:8000/api/v1"

interface ApiResponse<T = any> {
  data?: T
  error?: string
  status: number
}

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    // Récupérer le token du localStorage si disponible
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("access_token")
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", token)
    }
  }

  removeToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token")
      localStorage.removeItem("user_name")
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          error: data.detail || "Une erreur est survenue",
          status: response.status,
        }
      }

      return {
        data,
        status: response.status,
      }
    } catch (error) {
      return {
        error: "Erreur de connexion au serveur",
        status: 500,
      }
    }
  }

  // Méthodes d'authentification
  async login(phone_number: string, password: string) {
    const formData = new FormData()
    formData.append("username", phone_number)
    formData.append("password", password)

    const response = await fetch(`${this.baseURL}/user/login`, {
      method: "POST",
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        error: data.detail || "Erreur de connexion",
        status: response.status,
      }
    }

    // Stocker le token et le nom d'utilisateur
    this.setToken(data.access_token)
    if (typeof window !== "undefined") {
      localStorage.setItem("user_name", data.user_name)
    }

    return {
      data,
      status: response.status,
    }
  }

  // Méthodes utilisateurs
  async register(userData: {
    name: string
    phone_number: string
    appartement: string
    password: string
  }) {
    return this.request("/users/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async changePassword(data: {
    phone_number: string
    old_password: string
    new_password: string
  }) {
    return this.request("/users/change-password", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async forgotPassword(data: {
    phone_number: string
    new_password: string
  }) {
    return this.request("/users/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Méthodes formulaires/QR codes
  async createForm(formData: {
    name: string
    phone_number: string
    duration_minutes: number
  }) {
    return this.request("/forms/create-form", {
      method: "POST",
      body: JSON.stringify(formData),
    })
  }

  async getUserForms() {
    return this.request("/forms/user-forms")
  }

  async getForm(formId: string) {
    return this.request(`/forms/${formId}`)
  }

  async validateQRCode(qrData: string) {
    return this.request(`/forms/validate-qr-code?qr_data=${encodeURIComponent(qrData)}`)
  }

  async deleteForm(formId: string) {
    return this.request(`/forms/${formId}`, {
      method: "DELETE",
    })
  }

  async renewQRCode(formId: string, durationMinutes: number) {
    return this.request(`/forms/${formId}/renew?duration_minutes=${durationMinutes}`, {
      method: "POST",
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
