'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useMessages } from '@/hooks/useMessages'
import { useMessage } from '@/hooks/useMessage'
import { TicketThread } from '@/components/customer/TicketThread'
import { CustomerSidebar } from '@/components/customer/CustomerSidebar'
import { CustomerNav } from '@/components/customer/CustomerNav'
import { EmptyState } from '@/components/ui/EmptyState'

export default function PortalPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const { messages, loading, error } = useMessages({ status: statusFilter })
  
  // Use individual message hook for the selected message
  const {
    message: selectedMessage,
    loading: messageLoading,
    error: messageError,
    markResolved,
  } = useMessage(selectedId || 0)
  const [isResolving, setIsResolving] = useState(false)
  const [resolveError, setResolveError] = useState<string | null>(null)

  const handleMarkResolved = async () => {
    try {
      setIsResolving(true)
      setResolveError(null)
      await markResolved()
      // Refetch the messages list to update status in sidebar
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (err) {
      setResolveError(
        err instanceof Error ? err.message : 'Failed to resolve ticket'
      )
    } finally {
      setIsResolving(false)
    }
  }

  if (error) {
    return (
      <div className="bg-customer-bg min-h-screen flex items-center justify-center p-4">
        <EmptyState
          title="Something went wrong"
          subtitle={error.message}
          actionLabel="Retry"
          onAction={() => window.location.reload()}
        />
      </div>
    )
  }

  return (
    <div className="bg-customer-bg min-h-screen flex flex-col">
      <CustomerNav
        user={user}
        onLogout={logout}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="w-full md:w-80 flex-shrink-0 overflow-y-auto border-r border-customer-border">
          <div className="h-full">
            <CustomerSidebar
              messages={messages}
              selectedId={selectedId}
              statusFilter={statusFilter}
              onSelectTicket={setSelectedId}
              onFilterChange={setStatusFilter}
              onNewRequest={() => router.push('/customer/portal/new')}
              loading={loading}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {selectedId ? (
            (() => {
              const displayMessage = selectedMessage || messages.find((m) => m.id === selectedId)
              return displayMessage ? (
                <>
                  {resolveError && (
                    <div className="bg-red-50 border-b border-red-200 p-4 text-red-700 text-sm">
                      {resolveError}
                    </div>
                  )}
                  <TicketThread
                    message={displayMessage}
                    onMarkResolved={handleMarkResolved}
                    isLoading={isResolving}
                  />
                </>
              ) : (
                <EmptyState title="Ticket not found" />
              )
            })()
          ) : (
            <div className="h-full flex items-center justify-center">
              <EmptyState
                title="Select a ticket"
                subtitle="Choose a ticket from the list to view details"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
