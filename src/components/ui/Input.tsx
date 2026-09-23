import type { ReactNode } from 'react'
import { Input as AriaInput, Label, TextField, type TextFieldProps } from 'react-aria-components'
import { cn } from '@/lib/utils/cn'

export interface InputProps extends Omit<TextFieldProps, 'className' | 'children'> {
  label: string
  hideLabel?: boolean
  placeholder?: string
  /** Decorative element rendered inside the field, before the text. */
  leadingIcon?: ReactNode
  className?: string
}

export function Input({
  label,
  hideLabel = false,
  placeholder,
  leadingIcon,
  className,
  ...props
}: InputProps) {
  return (
    <TextField {...props} className={cn('flex flex-col gap-1.5', className)}>
      <Label className={hideLabel ? 'sr-only' : 'text-sm font-medium text-neutral-700'}>
        {label}
      </Label>
      <div className="relative">
        {leadingIcon ? (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-500">
            {leadingIcon}
          </span>
        ) : null}
        <AriaInput
          placeholder={placeholder}
          className={cn(
            'h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 shadow-xs outline-none',
            'placeholder:text-neutral-500',
            'data-focused:border-accent-500 data-focused:ring-2 data-focused:ring-accent-200',
            '[&::-webkit-search-cancel-button]:hidden',
            leadingIcon ? 'pl-9' : null,
          )}
        />
      </div>
    </TextField>
  )
}
