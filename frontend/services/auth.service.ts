import { api } from './api'

export interface LoginPayload {
  username: string
  password: string
}

export interface User {
  id: number
  username: string
  email: string
  role: 'ADMIN' | 'CUSTOMER'
}

export interface LoginResponse {
  user: User
  access: string
  refresh: string
}

export const authService = {
  async login(credentials: LoginPayload): Promise<LoginResponse> {
    return api.post<LoginResponse>('/api/accounts/login/', credentials, { skipAuth: true })
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
    }
  },

  saveTokens(response: LoginResponse) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', response.access)
      localStorage.setItem('refresh_token', response.refresh)
      localStorage.setItem('user', JSON.stringify(response.user))
    }
  },

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token')
    }
    return null
  },

  getUser(): User | null {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : null
    }
    return null
  },

  isAuthenticated(): boolean {
    return this.getToken() !== null
  },
}
