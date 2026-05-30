import { CustomerMessage } from '@/types'

interface ActivityLogProps {
  message: CustomerMessage
}

export function ActivityLog({ message }: ActivityLogProps) {
  const activities = [
    {
      label: 'Message received',
      timestamp: message.created_at,
      completed: true,
    },
    {
      label: 'Celery task queued',
      timestamp: message.created_at,
      completed: message.status !== 'OPEN',
    },
    {
      label: 'AI analysis complete',
      timestamp: message.created_at,
      completed: message.analysis !== undefined,
    },
    {
      label: 'Draft generated',
      timestamp: message.created_at,
      completed: message.analysis?.draft_reply !== undefined && message.analysis?.draft_reply !== '',
    },
    {
      label: 'Reply sent to customer',
      timestamp: message.created_at,
      completed: message.status === 'PENDING' || message.status === 'RESOLVED',
    },
    {
      label: 'Ticket resolved',
      timestamp: message.created_at,
      completed: message.status === 'RESOLVED',
    },
  ]

  return (
    <div className="bg-admin-surface rounded-lg border border-admin-border p-6">
      <h3 className="text-lg font-semibold text-admin-text mb-4">Activity Log</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="relative pt-1">
              <div
                className={`w-4 h-4 rounded-full border-2 ${
                  activity.completed
                    ? 'bg-admin-accent border-admin-accent'
                    : 'border-admin-border'
                }`}
              />
              {index < activities.length - 1 && (
                <div
                  className={`w-0.5 h-12 ml-1.5 mt-1 ${
                    activity.completed ? 'bg-admin-accent' : 'bg-admin-border'
                  }`}
                />
              )}
            </div>
            <div>
              <p
                className={`text-sm font-medium ${
                  activity.completed ? 'text-admin-text' : 'text-admin-muted'
                }`}
              >
                {activity.label}
              </p>
              <p className="text-xs text-admin-muted">
                {new Date(activity.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
