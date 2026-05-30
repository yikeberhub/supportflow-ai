'use client'

import { useEffect, useState } from 'react'
import { CustomerMessage } from '@/types'
import { messagesService } from '@/services/messages.service'

interface UseMessagesOptions {
  status?: string
  priority?: string
}

interface UseMessagesReturn {
  messages: CustomerMessage[]
  loading: boolean
  error: Error | null
  refetch: () => void
}

export function useMessages(options?: UseMessagesOptions): UseMessagesReturn {
  const [messages, setMessages] = useState<CustomerMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchMessages = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await messagesService.getMessages(options)
      setMessages(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch messages'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [options?.status, options?.priority])

  return {
    messages,
    loading,
    error,
    refetch: fetchMessages,
  }
}
