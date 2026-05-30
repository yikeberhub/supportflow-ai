import { api } from './api'
import { DashboardStats, NotificationLog } from '@/types'

export const dashboardService = {
  async getDashboardStats(): Promise<DashboardStats> {
    return api.get<DashboardStats>('/api/dashboard/stats/')
  },

  async getNotificationLogs(): Promise<NotificationLog[]> {
    return api.get<NotificationLog[]>('/api/notifications/logs/')
  },
}
