import { cn } from '@/lib/utils/cn'

export const controlClasses = cn(
  'w-full rounded-md border border-neutral-300 bg-white text-sm text-neutral-900 shadow-xs outline-none',
  'placeholder:text-neutral-500',
  'data-invalid:border-danger-700',
)

export const focusRingClasses =
  'data-focused:border-accent-500 data-focused:ring-2 data-focused:ring-accent-200'
