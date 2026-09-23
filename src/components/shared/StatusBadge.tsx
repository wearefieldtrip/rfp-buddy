import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils/cn'
import type { Tone } from '@/types/common'

const DOT_CLASSES: Record<Tone, string> = {
  neutral: 'bg-neutral-500',
  info: 'bg-accent-500',
  success: 'bg-success-700',
  warning: 'bg-warning-700',
  danger: 'bg-danger-700',
}

interface StatusBadgeProps {
  tone: Tone
  label: string
}

/** Badge with a leading dot, for any workflow status. Domain mapping lives in callers. */
export function StatusBadge({ tone, label }: StatusBadgeProps) {
  return (
    <Badge tone={tone}>
      <span aria-hidden="true" className={cn('size-1.5 rounded-full', DOT_CLASSES[tone])} />
      {label}
    </Badge>
  )
}
