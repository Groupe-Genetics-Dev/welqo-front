const API_BASE_URL = "https://welqo-api.onrender.com/api/v1";

  
interface ApiResponse<T = any> {
  data?: T
  error?: string
  status: number
}

interface LoginResponse {
  access_token: string
  token_type: string
  user_name: string
}

interface User {
  id: string
  name: string
  phone_number: string
  appartement: string
  created_at: string
}

interface AlerteData {
  alert_details: string
}

interface FormData {
  id: string
  name: string
  phone_number: string
  qr_code_data: string
  created_at: string
  expires_at: string
  user: User
}

interface QRValidationResponse {
  valid: boolean
  message: string
  data?: {
    user: {
      name: string
      phone_number: string
      appartement: string
    }
    visitor: {
      name: string
      phone_number: string
    }
    created_at: string
    expires_at: string
  }
}

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
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

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (response.status === 204) {
        return {
          data: null as unknown as T,
          status: response.status,
        }
      }

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

  async login(phone_number: string, password: string): Promise<ApiResponse<LoginResponse>> {
    const formData = new FormData()
    formData.append("username", phone_number)
    formData.append("password", password)

    try {
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

      this.setToken(data.access_token)
      if (typeof window !== "undefined") {
        localStorage.setItem("user_name", data.user_name)
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

  async register(userData: {
    name: string
    phone_number: string
    appartement: string
    password: string
    resident: string
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

  async forgotPassword(phoneNumber: string): Promise<ApiResponse<{ message: string }>> {
    return this.request("/users/forgot-password", {
      method: "POST",
      body: JSON.stringify({ phone_number: phoneNumber }),
    })
  }

  async resetPassword(
    phoneNumber: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<ApiResponse<{ message: string }>> {
    return this.request("/users/reset-password", {
      method: "POST",
      body: JSON.stringify({
        phone_number: phoneNumber,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }),
    })
  }

  async createForm(formData: {
    name: string
    phone_number: string
    duration_minutes: number
  }): Promise<ApiResponse<FormData>> {
    return this.request("/forms/create-form", {
      method: "POST",
      body: JSON.stringify(formData),
    })
  }

  async getUserForms(): Promise<ApiResponse<FormData[]>> {
    return this.request("/forms/user-forms")
  }

  async getAllForms(skip = 0, limit = 100): Promise<ApiResponse<FormData[]>> {
    return this.request(`/forms/all?skip=${skip}&limit=${limit}`)
  }

  async getForm(formId: string): Promise<ApiResponse<FormData>> {
    return this.request(`/forms/${formId}`)
  }

  async getPublicForm(formId: string): Promise<ApiResponse<FormData>> {
    return this.request(`/forms/public/${formId}`)
  }

  async validateQRCode(qrData: string): Promise<ApiResponse<QRValidationResponse>> {
    return this.request(`/forms/validate-qr-code?qr_data=${encodeURIComponent(qrData)}`)
  }

  async updateForm(
    formId: string,
    formData: {
      name?: string
      phone_number?: string
    },
  ): Promise<ApiResponse<FormData>> {
    return this.request(`/forms/${formId}`, {
      method: "PUT",
      body: JSON.stringify(formData),
    })
  }

  async deleteForm(formId: string): Promise<ApiResponse<null>> {
    return this.request(`/forms/${formId}`, {
      method: "DELETE",
    })
  }

  async renewQRCode(formId: string, durationMinutes: number): Promise<ApiResponse<FormData>> {
    return this.request(`/forms/${formId}/renew?duration_minutes=${durationMinutes}`, {
      method: "POST",
    })
  }

  async sendAlert(alertData: {
    alert_details: string
  }): Promise<ApiResponse<{ message: string; recipients_count?: number }>> {
    return this.request("/users/send-alert", {
      method: "POST",
      body: JSON.stringify(alertData),
    })
  }

  isAuthenticated(): boolean {
    return !!this.token
  }

  getUserInfo(): { token: string | null; userName: string | null } {
    if (typeof window === "undefined") {
      return { token: null, userName: null }
    }

    return {
      token: this.token,
      userName: localStorage.getItem("user_name"),
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
export type { ApiResponse, LoginResponse, FormData, QRValidationResponse }


