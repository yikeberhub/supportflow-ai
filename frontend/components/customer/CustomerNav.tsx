'use client'

import { User } from '@/types'
import { useRouter } from 'next/navigation'
import { Star, LogOut } from 'lucide-react'

interface CustomerNavProps {
  user: User | null
  onLogout: () => void
}

export function CustomerNav({ user, onLogout }: CustomerNavProps) {
  const router = useRouter()

  const handleLogout = () => {
    onLogout()
    router.push('/')
  }

  const userInitials = user
    ? user.username
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U'

  return (
    <nav className="bg-customer-surface border-b border-customer-border sticky top-0 z-50">
      <div className="h-16 px-6 flex items-center justify-between">
        {/* Left: Logo and Branding */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-customer-accent/10 flex items-center justify-center flex-shrink-0">
              <Star className="w-5 h-5 text-customer-accent fill-customer-accent" />
            </div>
            <div className="font-bold text-lg tracking-tight">
              <span className="text-customer-text">Support</span>
              <span className="text-customer-accent">Flow</span>
            </div>
          </div>

          {/* Separator */}
          <div className="w-px h-6 bg-customer-border"></div>

          {/* Help Center Link */}
          <a
            href="#help"
            className="text-sm text-customer-muted hover:text-customer-text transition-colors"
          >
            Help Center
          </a>
        </div>

        {/* Right: User and Actions */}
        <div className="flex items-center gap-4">
          {/* User Pill */}
          {user && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-customer-bg border border-customer-border">
              <div className="w-6 h-6 rounded-full bg-customer-accent text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">
                {userInitials}
              </div>
              <span className="text-sm font-medium text-customer-text">
                {user.username}
              </span>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2 text-customer-muted hover:text-customer-text hover:bg-customer-bg rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  )
}
