import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

export function PanelHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
      {description ? <p className="mt-1 text-sm text-neutral-600">{description}</p> : null}
    </div>
  )
}

export function Card({
  title,
  children,
  className,
}: {
  title?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section
      aria-label={title}
      className={cn('rounded-lg border border-neutral-200 bg-white p-5 shadow-xs', className)}
    >
      {title ? <h3 className="mb-3 text-base font-semibold text-neutral-900">{title}</h3> : null}
      {children}
    </section>
  )
}

export interface Fact {
  label: string
  value: ReactNode
}

export function FactList({ facts }: { facts: Fact[] }) {
  return (
    <dl className="divide-y divide-neutral-200">
      {facts.map((fact) => (
        <div key={fact.label} className="py-2.5 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt className="text-sm font-medium text-neutral-600">{fact.label}</dt>
          <dd className="mt-1 text-sm text-neutral-900 sm:col-span-2 sm:mt-0">{fact.value}</dd>
        </div>
      ))}
    </dl>
  )
}
