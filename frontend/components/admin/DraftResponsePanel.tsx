import { useState } from 'react'
import { Button } from '../ui/Button'

interface DraftResponsePanelProps {
  draft: string
  onSend: () => Promise<void>
  onRegenerate: () => void
  isLoading?: boolean
}

export function DraftResponsePanel({
  draft,
  onSend,
  onRegenerate,
  isLoading = false,
}: DraftResponsePanelProps) {
  const [editedDraft, setEditedDraft] = useState(draft)
  const [isEditing, setIsEditing] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const handleSend = async () => {
    setIsSending(true)
    try {
      await onSend()
    } finally {
      setIsSending(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(editedDraft)
  }

  return (
    <div className="bg-admin-surface rounded-lg border border-admin-border p-6 mb-6">
      <h3 className="text-lg font-semibold text-admin-text mb-4">
        Draft Response
      </h3>
      {isEditing ? (
        <textarea
          value={editedDraft}
          onChange={(e) => setEditedDraft(e.target.value)}
          className="w-full h-48 p-3 bg-admin-bg border border-admin-border text-admin-text rounded mb-4 focus:outline-none focus:ring-2 focus:ring-admin-accent"
        />
      ) : (
        <div className="w-full h-48 p-3 bg-admin-bg border border-admin-border text-admin-text rounded mb-4 overflow-auto whitespace-pre-wrap">
          {editedDraft}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {isEditing ? (
          <>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              Done Editing
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setEditedDraft(draft)}>
              Reset
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSend}
              isLoading={isSending}
            >
              Send to Customer
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
            <Button variant="secondary" size="sm" onClick={onRegenerate}>
              Regenerate
            </Button>
            <Button variant="secondary" size="sm" onClick={handleCopy}>
              Copy
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
