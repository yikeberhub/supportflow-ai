
export interface User{
  id: number
  username: string
  email: string
  role: 'ADMIN' | 'CUSTOMER'
}

export interface AIAnalysis {
  id: number
  message: number
  category: string
  priority: string
  sentiment: string
  summary: string
  draft_reply: string
  action_required: boolean
  created_at: string
}

export interface CustomerMessage {
  id: number
  user?: User
  content: string
  status: 'OPEN' | 'PENDING' | 'RESOLVED'
  is_processed: boolean
  created_at: string
  analysis?: AIAnalysis
}

export interface AnalysedMessage {
  id: number,
  message: CustomerMessage,
  category: string,
  priority: string,
  sentiment: string,
  summary: string,
  draft_reply: string,
  action_required:boolean,
  created_at: string,
  

}




export interface DashboardStats {
  total_issues: number
  urgent_cases: number
  resolved: number
  avg_response_hours: number
}

export interface NotificationLog {
  id: number
  type: string
  message: string
  sent_at: string
  status: string
}

export interface CreateMessagePayload {
  customer_name?: string
  order_number?: string
  category: string
  message: string
  contact_preference?: 'Portal' | 'Email' | 'Both'
}

export type BadgeVariant =
  | 'high'
  | 'medium'
  | 'low'
  | 'open'
  | 'resolved'
  | 'pending'
  | 'urgent'
  | 'new'
  | 'category'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md'
