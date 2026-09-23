import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <div
        aria-hidden="true"
        className="mb-4 flex size-12 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 shadow-xs"
      >
        {icon}
      </div>
      <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-neutral-600">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}
