'use client'

import { useEffect, useState } from 'react'
import { CustomerMessage } from '@/types'
import { messagesService } from '@/services/messages.service'

interface UseMessageReturn {
  message: CustomerMessage | null
  loading: boolean
  error: Error | null
  sendReply: (reply: string) => Promise<void>
  markResolved: () => Promise<void>
  refetch: () => void
}

export function useMessage(id: number): UseMessageReturn {
  const [message, setMessage] = useState<CustomerMessage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchMessage = async () => {
    if (!id || id <= 0) {
      setMessage(null)
      setLoading(false)
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      const data = await messagesService.getMessageById(id)
      setMessage(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch message'))
    } finally {
      setLoading(false)
    }
  }

  const sendReply = async (reply: string) => {
    try {
      const updated = await messagesService.updateMessageStatus(id, 'PENDING')
      setMessage(updated)
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to send reply')
    }
  }

  const markResolved = async () => {
    try {
      const updated = await messagesService.updateMessageStatus(id, 'RESOLVED')
      setMessage(updated)
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to mark resolved')
    }
  }

  useEffect(() => {
    fetchMessage()
  }, [id])

  return {
    message,
    loading,
    error,
    sendReply,
    markResolved,
    refetch: fetchMessage,
  }
}
