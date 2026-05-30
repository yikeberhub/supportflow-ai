'use client'

import { CustomerMessage } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { Plus } from 'lucide-react'

interface CustomerSidebarProps {
  messages: CustomerMessage[]
  selectedId: number | null
  statusFilter: string | undefined
  onSelectTicket: (id: number) => void
  onFilterChange: (status: string | undefined) => void
  onNewRequest: () => void
  loading: boolean
}

export function CustomerSidebar({
  messages,
  selectedId,
  statusFilter,
  onSelectTicket,
  onFilterChange,
  onNewRequest,
  loading,
}: CustomerSidebarProps) {
  const statuses = ['All', 'OPEN', 'PENDING', 'RESOLVED']

  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-700'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700'
      case 'low':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-orange-100 text-orange-700'
      case 'PENDING':
        return 'bg-blue-100 text-blue-700'
      case 'RESOLVED':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <aside className="w-full bg-customer-surface flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="border-b border-customer-border p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-lg font-semibold text-customer-text">My requests</div>
          <button
            onClick={onNewRequest}
            className="flex items-center gap-2 px-3 py-2 bg-customer-accent hover:opacity-90 text-white rounded transition-all text-sm font-medium"
          >
            <Plus size={13} />
            New request
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-customer-border p-4">
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() =>
                onFilterChange(status === 'All' ? undefined : status)
              }
              className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                (status === 'All' && !statusFilter) || statusFilter === status
                  ? 'bg-customer-accent text-white'
                  : 'bg-customer-bg text-customer-text hover:bg-customer-border'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Ticket List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-customer-muted text-sm">Loading tickets...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full p-4 text-center">
            <div>
              <p className="text-customer-text font-medium text-sm">No tickets</p>
              <p className="text-customer-muted text-xs mt-1">
                You haven't created any support requests yet
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-customer-border">
            {messages?.map((message) => (
              <button
                key={message.id}
                onClick={() => onSelectTicket(message.id)}
                className={`w-full text-left p-4 transition-colors hover:bg-customer-bg ${
                  selectedId === message.id
                    ? 'bg-customer-accent/10 border-l-4 border-customer-accent'
                    : ''
                }`}
              >
                {/* Top Row: Subject, Time, Unread */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-customer-text text-sm truncate">
                      {message.content.split('\n')[0].substring(0, 40)}
                    </p>
                  </div>
                  <div className="text-customer-muted text-xs flex-shrink-0">
                    {formatDistanceToNow(new Date(message.created_at), {
                      addSuffix: true,
                    })}
                  </div>
                  {message.status === 'OPEN' && (
                    <div className="w-2 h-2 rounded-full bg-customer-accent flex-shrink-0 mt-1"></div>
                  )}
                </div>

                {/* Preview */}
                <p className="text-customer-muted text-xs mb-3 truncate">
                  {message.content.substring(0, 60)}…
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {message.analysis && (
                    <span
                      className={`text-xs px-2 py-1 rounded font-medium ${getPriorityColor(
                        message.analysis.priority
                      )}`}
                    >
                      {message.analysis.priority}
                    </span>
                  )}
                  <span
                    className={`text-xs px-2 py-1 rounded font-medium ${getStatusColor(
                      message.status
                    )}`}
                  >
                    {message.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
