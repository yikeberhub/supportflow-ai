const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>
  skipAuth?: boolean
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token && !options.skipAuth) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const error = new Error(
      errorData.detail || `API error: ${response.statusText}`
    ) as Error & { status?: number }
    error.status = response.status
    throw error
  }

  return response.json() as Promise<T>
}

export const api = {
  get: <T,>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),

  post: <T,>(endpoint: string, data?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),

  patch: <T,>(endpoint: string, data?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),
}
