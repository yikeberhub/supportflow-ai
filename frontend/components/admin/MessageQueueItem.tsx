import { CustomerMessage } from '@/types'
import { Badge } from '../ui/Badge'
import { formatDistanceToNow } from 'date-fns'

interface MessageQueueItemProps {
  message: CustomerMessage
  isActive: boolean
  onClick: () => void
}

export function MessageQueueItem({
  message,
  isActive,
  onClick,
}: MessageQueueItemProps) {
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
      className={`w-full text-left px-4 py-3 border-b border-admin-border transition-colors ${
        isActive ? 'bg-admin-surface2' : 'hover:bg-admin-surface2'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate text-admin-text">
            {message.user?.username || 'Customer'}
          </p>
          <p className="text-sm truncate mt-1 text-admin-muted">{preview}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {message.analysis && (
            <Badge variant={priorityMap[message.analysis.priority] || 'low'}>
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
          >
            {message.status}
          </Badge>
        </div>
      </div>
      <p className="text-xs mt-2 text-admin-muted">
        {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
      </p>
    </button>
  )
}
