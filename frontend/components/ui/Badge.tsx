import { BadgeVariant } from '@/types'

interface BadgeProps {
  variant: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  high: 'bg-red-100 text-red-800 border border-red-300',
  medium: 'bg-amber-100 text-amber-800 border border-amber-300',
  low: 'bg-green-100 text-green-800 border border-green-300',
  open: 'bg-blue-100 text-blue-800 border border-blue-300',
  resolved: 'bg-green-100 text-green-800 border border-green-300',
  pending: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  urgent: 'bg-red-100 text-red-800 border border-red-300',
  new: 'bg-blue-100 text-blue-800 border border-blue-300',
  category: 'bg-purple-100 text-purple-800 border border-purple-300',
}

export function Badge({ variant, children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
