import { CustomerMessage } from '@/types'
import { Badge } from '../ui/Badge'

interface TicketThreadProps {
  message: CustomerMessage
  onMarkResolved: () => void
  isLoading?: boolean
}

export function TicketThread({
  message,
  onMarkResolved,
  isLoading = false,
}: TicketThreadProps) {
  const analysis = message.analysis
  
  const statusSteps = ['Submitted', 'AI Analysed', 'Reply Sent', 'Resolved']
  const statusMap: Record<string, number> = {
    OPEN: 0,
    PENDING: 1,
    RESOLVED: 3,
  }
  const currentStep = statusMap[message.status] || 0

  const priorityMap: Record<string, 'high' | 'medium' | 'low'> = {
    High: 'high',
    high: 'high',
    Medium: 'medium',
    medium: 'medium',
    Low: 'low',
    low: 'low',
  }

  return (
    <div className="bg-customer-surface">
      <div className="border-b border-customer-border p-6">
        <h1 className="text-2xl font-semibold text-customer-text">
          {message.content.split('\n')[0]}
        </h1>
        <p className="text-sm text-customer-muted mt-2">
          Ticket #{message.id} • {new Date(message.created_at).toLocaleDateString()}
        </p>
      </div>

      {analysis && (
        <div className="border-b border-customer-border p-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <p className="text-xs text-customer-muted uppercase">Category</p>
              <Badge variant="category" className="mt-1">
                {analysis.category}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-customer-muted uppercase">Priority</p>
              <Badge variant={priorityMap[analysis.priority] || 'low'} className="mt-1">
                {analysis.priority}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-customer-muted uppercase">Sentiment</p>
              <Badge variant="category" className="mt-1">
                {analysis.sentiment}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-customer-muted uppercase">Status</p>
              <Badge
                variant={
                  message.status === 'RESOLVED'
                    ? 'resolved'
                    : message.status === 'PENDING'
                      ? 'open'
                      : 'pending'
                }
                className="mt-1"
              >
                {message.status}
              </Badge>
            </div>
          </div>
        </div>
      )}

      <div className="border-b border-customer-border p-6">
        <h3 className="font-semibold text-customer-text mb-4">Status Progress</h3>
        <div className="flex items-center justify-between">
          {statusSteps.map((step, index) => (
            <div key={step} className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  index <= currentStep
                    ? 'bg-customer-accent text-white'
                    : 'bg-customer-border text-customer-muted'
                }`}
              >
                {index + 1}
              </div>
              <p
                className={`text-xs mt-2 ${
                  index <= currentStep ? 'text-customer-text' : 'text-customer-muted'
                }`}
              >
                {step}
              </p>
              {index < statusSteps.length - 1 && (
                <div
                  className={`h-1 w-full mt-2 ${
                    index < currentStep
                      ? 'bg-customer-accent'
                      : 'bg-customer-border'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="border-b border-customer-border p-6">
        <h3 className="font-semibold text-customer-text mb-4">Your Message</h3>
        <div className="bg-customer-bg p-4 rounded border border-customer-border">
          <p className="text-customer-text whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
      </div>

      {analysis && analysis.summary && (
        <div className="border-b border-customer-border p-6">
          <h3 className="font-semibold text-customer-text mb-4">
            AI Analysis Summary
          </h3>
          <div className="bg-customer-bg p-4 rounded border border-customer-border">
            <p className="text-customer-text whitespace-pre-wrap">
              {analysis.summary}
            </p>
          </div>
        </div>
      )}

      {analysis && analysis.draft_reply && (
        <div className="border-b border-customer-border p-6">
          <h3 className="font-semibold text-customer-text mb-4">
            AI-Assisted Reply
          </h3>
          <div className="bg-customer-bg p-4 rounded border border-customer-border">
            <Badge variant="category" className="mb-3">
              AI-assisted
            </Badge>
            <p className="text-customer-text whitespace-pre-wrap">
              {analysis.draft_reply}
            </p>
          </div>
        </div>
      )}

      <div className="p-6">
        {message.status !== 'RESOLVED' && (
          <button
            onClick={onMarkResolved}
            disabled={isLoading}
            className="w-full bg-customer-accent hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Resolving...
              </span>
            ) : (
              'Mark as Resolved'
            )}
          </button>
        )}
        {message.status === 'RESOLVED' && (
          <div className="text-center py-3 px-4 bg-green-50 border border-green-200 rounded text-green-700 font-medium">
            ✓ This ticket is resolved
          </div>
        )}
      </div>
    </div>
  )
}
