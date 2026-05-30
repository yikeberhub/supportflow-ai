'use client'

import { useEffect, useState } from 'react'
import { DashboardStats, NotificationLog } from '@/types'
import { dashboardService } from '@/services/dashboard.service'

interface UseDashboardStatsReturn {
  stats: DashboardStats | null
  logs: NotificationLog[]
  loading: boolean
  error: Error | null
  refetch: () => void
}

export function useDashboardStats(): UseDashboardStatsReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [logs, setLogs] = useState<NotificationLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [statsData, logsData] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getNotificationLogs(),
      ])
      setStats(statsData)
      setLogs(logsData)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch dashboard data'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    stats,
    logs,
    loading,
    error,
    refetch: fetchData,
  }
}
