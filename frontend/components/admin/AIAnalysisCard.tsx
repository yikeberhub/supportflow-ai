import { CustomerMessage } from '@/types'
import { Badge } from '../ui/Badge'

interface AIAnalysisCardProps {
  message: CustomerMessage
}

export function AIAnalysisCard({ message }: AIAnalysisCardProps) {
  const priorityMap: Record<string, 'high' | 'medium' | 'low'> = {
    High: 'high',
    high: 'high',
    Medium: 'medium',
    medium: 'medium',
    Low: 'low',
    low: 'low',
  }

  if (!message.analysis) {
    return (
      <div className="bg-admin-surface rounded-lg border border-admin-border p-6 mb-6">
        <h3 className="text-lg font-semibold text-admin-text mb-4">
          AI Analysis Result
        </h3>
        <p className="text-admin-muted">Analysis pending...</p>
      </div>
    )
  }

  return (
    <div className="bg-admin-surface rounded-lg border border-admin-border p-6 mb-6">
      <h3 className="text-lg font-semibold text-admin-text mb-4">
        AI Analysis Result
      </h3>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div>
          <p className="text-xs text-admin-muted uppercase mb-2">Category</p>
          <Badge variant="category">{message.analysis.category}</Badge>
        </div>
        <div>
          <p className="text-xs text-admin-muted uppercase mb-2">Priority</p>
          <Badge variant={priorityMap[message.analysis.priority] || 'low'}>
            {message.analysis.priority}
          </Badge>
        </div>
        <div>
          <p className="text-xs text-admin-muted uppercase mb-2">Sentiment</p>
          <Badge variant="category">{message.analysis.sentiment}</Badge>
        </div>
        <div>
          <p className="text-xs text-admin-muted uppercase mb-2">Status</p>
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
    </div>
  )
}
