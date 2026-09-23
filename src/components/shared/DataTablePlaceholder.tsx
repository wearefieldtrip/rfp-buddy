import type { ReactNode } from 'react'
import { EmptyState } from './EmptyState'

interface DataTablePlaceholderProps {
  icon: ReactNode
  title: string
  description: string
}

/** Stands in for a section's data view until that section is built. */
export function DataTablePlaceholder({ icon, title, description }: DataTablePlaceholderProps) {
  return (
    <section
      aria-label={title}
      className="rounded-lg border border-dashed border-neutral-300 bg-white"
    >
      <EmptyState icon={icon} title={title} description={description} />
    </section>
  )
}
