import { CustomerMessage } from '@/types'
import { Badge } from '../ui/Badge'
import { formatDistanceToNow } from 'date-fns'

interface TicketListItemProps {
  message: CustomerMessage
  isActive: boolean
  onClick: () => void
}

export function TicketListItem({
  message,
  isActive,
  onClick,
}: TicketListItemProps) {
  const preview = message.content.substring(0, 60)
  const priorityMap: Record<string, 'high' | 'medium' | 'low'> = {
    High: 'high',
    high: 'high',
    Medium: 'medium',
    medium: 'medium',
    Low: 'low',
    low: 'low',
  }

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 border-b border-customer-border transition-colors ${
        isActive ? 'bg-customer-accent text-white' : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p
            className={`font-medium truncate ${
              isActive ? 'text-white' : 'text-customer-text'
            }`}
          >
            {message.user?.username || 'Customer'}
          </p>
          <p
            className={`text-sm truncate mt-1 ${
              isActive ? 'text-white/80' : 'text-customer-muted'
            }`}
          >
            {preview}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {message.analysis && (
            <Badge
              variant={priorityMap[message.analysis.priority] || 'low'}
              className="text-xs"
            >
              {message.analysis.priority}
            </Badge>
          )}
          <Badge
            variant={
              message.status === 'RESOLVED'
                ? 'resolved'
                : message.status === 'PENDING'
                  ? 'open'
                  : 'pending'
            }
            className="text-xs"
          >
            {message.status}
          </Badge>
        </div>
      </div>
      <p
        className={`text-xs mt-2 ${
          isActive ? 'text-white/60' : 'text-customer-muted'
        }`}
      >
        {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
      </p>
    </button>
  )
}
