import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

// Semantic <table> with styling only. Swap for React Aria's Table if we later
// need row selection, sorting, or grid keyboard navigation.

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  /** Accessible name for the table. */
  label: string
}

export function Table({ label, className, ...props }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white shadow-xs">
      <table
        aria-label={label}
        className={cn('w-full border-collapse text-left text-sm', className)}
        {...props}
      />
    </div>
  )
}

export function TableHead({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn('border-b border-neutral-200 bg-neutral-50', className)} {...props} />
}

export function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn('divide-y divide-neutral-200', className)} {...props} />
}

export function TableRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn('hover:bg-neutral-50', className)} {...props} />
}

export function TableHeaderCell({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      scope="col"
      className={cn('px-3 py-3 text-xs font-medium whitespace-nowrap text-neutral-600', className)}
      {...props}
    />
  )
}

export function TableCell({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn('px-3 py-3 align-middle text-neutral-700', className)} {...props} />
}
