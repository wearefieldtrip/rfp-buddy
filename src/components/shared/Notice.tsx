import { AlertTriangle, InfoCircle } from '@untitledui/icons'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

type NoticeTone = 'info' | 'warning'

const TONE_CLASSES: Record<NoticeTone, string> = {
  info: 'border-accent-200 bg-accent-50 text-accent-700',
  warning: 'border-warning-200 bg-warning-50 text-warning-700',
}

interface NoticeProps {
  tone?: NoticeTone
  title: string
  children?: ReactNode
  className?: string
}

export function Notice({ tone = 'info', title, children, className }: NoticeProps) {
  const Icon = tone === 'warning' ? AlertTriangle : InfoCircle
  return (
    <div
      role="note"
      className={cn('flex gap-3 rounded-lg border p-4 text-sm', TONE_CLASSES[tone], className)}
    >
      <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <div>
        <p className="font-semibold">{title}</p>
        {children ? <div className="mt-1">{children}</div> : null}
      </div>
    </div>
  )
}
