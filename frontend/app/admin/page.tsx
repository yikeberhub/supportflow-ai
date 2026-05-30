'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'

export default function AdminPage() {
  const router = useRouter()
  const { user, logout } = useAuth()

  return (
    <div className="bg-admin-bg min-h-screen">
      {/* Header */}
      <div className="bg-admin-surface border-b border-admin-border p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-admin-text mb-2">Admin Dashboard</h1>
            <p className="text-admin-muted">Manage customer support and AI automation</p>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="text-right">
                <p className="text-admin-text font-medium">{user.username}</p>
                <p className="text-admin-muted text-sm">{user.email}</p>
              </div>
            )}
            <button
              onClick={logout}
              className="px-4 py-2 bg-admin-accent hover:bg-opacity-90 text-white rounded transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-admin-surface border border-admin-border rounded-lg p-6">
            <p className="text-admin-muted text-sm mb-2">Total Messages</p>
            <p className="text-4xl font-bold text-admin-text">0</p>
          </div>
          <div className="bg-admin-surface border border-admin-border rounded-lg p-6">
            <p className="text-admin-muted text-sm mb-2">Pending</p>
            <p className="text-4xl font-bold text-admin-accent">0</p>
          </div>
          <div className="bg-admin-surface border border-admin-border rounded-lg p-6">
            <p className="text-admin-muted text-sm mb-2">Analysed</p>
            <p className="text-4xl font-bold text-admin-text">0</p>
          </div>
          <div className="bg-admin-surface border border-admin-border rounded-lg p-6">
            <p className="text-admin-muted text-sm mb-2">Resolved</p>
            <p className="text-4xl font-bold text-admin-text">0</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-admin-surface border border-admin-border rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-admin-text mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => router.push('/admin/inbox')}>
              View Inbox
            </Button>
            <Button variant="secondary" onClick={() => router.push('/admin/settings')}>
              Settings
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-admin-surface border border-admin-border rounded-lg p-6">
          <h2 className="text-2xl font-bold text-admin-text mb-4">Recent Activity</h2>
          <div className="text-admin-muted text-center py-8">
            <p>No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  )
}
