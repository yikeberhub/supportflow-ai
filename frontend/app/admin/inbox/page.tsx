'use client'

import { useState, useMemo } from 'react'
import { useMessages } from '@/hooks/useMessages'
import { MessageQueueItem } from '@/components/admin/MessageQueueItem'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function InboxPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'priority' | 'newest' | 'oldest'>('priority')
  const { messages, loading, error } = useMessages()

  const filteredAndSortedMessages = useMemo(() => {
    let filtered = messages.filter(
      (msg) =>
        msg.customer?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.content.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (sortBy === 'priority') {
      const priorityOrder = { High: 0, Medium: 1, Low: 2 }
      filtered.sort(
        (a, b) =>
          (priorityOrder[a.priority as keyof typeof priorityOrder] ?? 3) -
          (priorityOrder[b.priority as keyof typeof priorityOrder] ?? 3)
      )
    } else if (sortBy === 'newest') {
      filtered.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    } else if (sortBy === 'oldest') {
      filtered.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
    }

    return filtered
  }, [messages, searchTerm, sortBy])

  if (error) {
    return (
      <div className="bg-admin-bg min-h-screen flex items-center justify-center p-4">
        <EmptyState
          title="Something went wrong"
          subtitle={error.message}
        />
      </div>
    )
  }

  return (
    <div className="bg-admin-bg min-h-screen flex">
      <aside className="w-64 bg-admin-surface border-r border-admin-border p-6">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-admin-text">Navigation</h2>
          <nav className="space-y-1">
            <a
              href="/admin/inbox"
              className="block px-3 py-2 rounded bg-admin-surface2 text-admin-accent font-medium"
            >
              📥 Inbox
            </a>
            <a
              href="/admin/inbox"
              className="block px-3 py-2 rounded text-admin-text hover:bg-admin-surface2"
            >
              ⭐ Starred
            </a>
            <a
              href="/admin/inbox"
              className="block px-3 py-2 rounded text-admin-text hover:bg-admin-surface2"
            >
              📋 All Messages
            </a>
          </nav>
        </div>
      </aside>

      <div className="flex-1 flex">
        <div className="w-80 bg-admin-surface border-r border-admin-border flex flex-col">
          <div className="p-4 border-b border-admin-border space-y-3">
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-admin-bg border border-admin-border text-admin-text rounded focus:outline-none focus:ring-2 focus:ring-admin-accent"
            />
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'priority' | 'newest' | 'oldest')
              }
              className="w-full px-3 py-2 bg-admin-bg border border-admin-border text-admin-text rounded focus:outline-none focus:ring-2 focus:ring-admin-accent"
            >
              <option value="priority">Priority</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <LoadingSpinner message="Loading messages..." />
            ) : filteredAndSortedMessages.length === 0 ? (
              <EmptyState
                title="No messages"
                subtitle={
                  searchTerm
                    ? 'Try a different search'
                    : 'Your inbox is empty'
                }
              />
            ) : (
              filteredAndSortedMessages.map((message) => (
                <MessageQueueItem
                  key={message.id}
                  message={message}
                  isActive={selectedId === message.id}
                  onClick={() => setSelectedId(message.id)}
                />
              ))
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {selectedId ? (
            <SelectedMessageDetail selectedId={selectedId} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <EmptyState
                title="Select a message"
                subtitle="Choose a message from the queue to view details"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SelectedMessageDetail({ selectedId }: { selectedId: number }) {
  const { messages, loading } = useMessages()
  const selectedMessage = messages.find((m) => m.id === selectedId)

  if (loading) {
    return <LoadingSpinner message="Loading..." />
  }

  if (!selectedMessage) {
    return (
      <EmptyState
        title="Message not found"
      />
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl">
        <div className="text-admin-text">
          <h2 className="text-2xl font-bold mb-4">{selectedMessage.customer.username}</h2>
          <p className="whitespace-pre-wrap mb-4">{selectedMessage.content}</p>
        </div>
      </div>
    </div>
  )
}
