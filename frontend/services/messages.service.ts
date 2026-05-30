import { api } from './api'
import { CustomerMessage, CreateMessagePayload } from '@/types'

interface MessageFilters {
  status?: string
  priority?: string
}

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export const messagesService = {
  async getMessages(filters?: MessageFilters): Promise<CustomerMessage[]> {
    const params = new URLSearchParams()
    if (filters?.status) params.append('status', filters.status)
    if (filters?.priority) params.append('priority', filters.priority)

    const query = params.toString()
    const endpoint = `/api/messages/${query ? '?' + query : ''}`

    const response = await api.get<PaginatedResponse<CustomerMessage>>(endpoint)
    return response.results || []
  },

  async getMessageById(id: number): Promise<CustomerMessage> {
    return api.get<CustomerMessage>(`/api/messages/${id}/`)
  },

  async createMessage(data: CreateMessagePayload): Promise<CustomerMessage> {
    return api.post<CustomerMessage>('/api/messages/', data)
  },

  async updateMessageStatus(
    id: number,
    status: string
  ): Promise<CustomerMessage> {
    return api.patch<CustomerMessage>(`/api/messages/${id}/`, { status })
  },
}
