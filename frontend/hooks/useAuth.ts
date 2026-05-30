'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService, User } from '@/services/auth.service'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const auth = authService.isAuthenticated()
    const currentUser = authService.getUser()

    setIsAuthenticated(auth)
    setUser(currentUser)
    setLoading(false)

    // Redirect to login if not authenticated (only on client-side pages that need auth)
    if (!auth) {
      // Don't redirect here - let the component decide
    }
  }, [router])

  const logout = () => {
    authService.logout()
    setUser(null)
    setIsAuthenticated(false)
    router.push('/')
  }

  return {
    user,
    loading,
    isAuthenticated,
    logout,
  }
}
