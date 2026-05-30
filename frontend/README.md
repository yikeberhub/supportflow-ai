# SupportFlow AI Frontend

AI-powered customer support platform frontend built with Next.js 14, TypeScript, and Tailwind CSS.

## Architecture

### Services Layer (`/services`)
All API calls are abstracted into service functions:
- `api.ts` — Base API client with token handling
- `messages.service.ts` — Customer message operations
- `dashboard.service.ts` — Dashboard stats and notifications

### Hooks (`/hooks`)
Custom React hooks for data fetching and state management:
- `useMessages()` — Fetch all messages with optional filters
- `useMessage(id)` — Fetch single message with actions
- `useDashboardStats()` — Fetch dashboard statistics

### Components

**UI Components** (`/components/ui`):
- `Badge` — Status and priority badges
- `Button` — Reusable button component
- `LoadingSpinner` — Loading indicator
- `EmptyState` — Empty state messaging

**Customer Components** (`/components/customer`):
- `TicketListItem` — Individual ticket in list
- `TicketThread` — Full ticket detail view

**Admin Components** (`/components/admin`):
- `MessageQueueItem` — Message in queue
- `AIAnalysisCard` — AI analysis results
- `DraftResponsePanel` — Editable AI response
- `ActivityLog` — Timeline of ticket activity

### Routes

**Customer Portal** (`/portal` route group):
- `/portal` — Ticket list view
- `/portal/new` — Create new request
- `/portal/[id]` — Individual ticket detail

**Admin Dashboard** (`/inbox` route group):
- `/inbox` — Message queue (protected)
- `/inbox/[id]` — Message detail (protected)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set environment variables in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. Run dev server:
```bash
npm run dev
```

Visit `http://localhost:3000`

## Design System

### Customer Portal
Light theme optimized for customers:
- Background: `#F5F3EE`
- Primary accent: `#1A6B4A` (green)

### Admin Dashboard
Dark theme for operations:
- Background: `#111210`
- Primary accent: `#3EB87A` (green)

Both use DM Sans font from Google Fonts.

## Development

- **Type checking**: `npm run type-check`
- **Linting**: `npm run lint`
- **Building**: `npm run build`

No Redux — state is managed with React hooks and context where needed.
