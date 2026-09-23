import type { ReactNode } from 'react'
import { Input as AriaInput, TextField, type TextFieldProps } from 'react-aria-components'
import { cn } from '@/lib/utils/cn'
import { FieldDescription, FieldErrorText, FieldLabel } from './Field'
import { controlClasses, focusRingClasses } from './fieldStyles'

export interface InputProps extends Omit<
  TextFieldProps,
  'className' | 'children' | 'isInvalid' | 'validationBehavior'
> {
  label: string
  hideLabel?: boolean
  placeholder?: string
  description?: string
  /** When set, the field is marked invalid and this message is shown and announced. */
  errorMessage?: string
  /** Decorative element rendered inside the field, before the text. */
  leadingIcon?: ReactNode
  className?: string
}

export function Input({
  label,
  hideLabel = false,
  placeholder,
  description,
  errorMessage,
  leadingIcon,
  className,
  ...props
}: InputProps) {
  return (
    <TextField
      {...props}
      validationBehavior="aria"
      isInvalid={Boolean(errorMessage)}
      className={cn('flex flex-col gap-1.5', className)}
    >
      <FieldLabel label={label} hideLabel={hideLabel} isRequired={props.isRequired} />
      <div className="relative">
        {leadingIcon ? (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-500">
            {leadingIcon}
          </span>
        ) : null}
        <AriaInput
          placeholder={placeholder}
          className={cn(
            controlClasses,
            focusRingClasses,
            'h-10 px-3',
            '[&::-webkit-search-cancel-button]:hidden',
            leadingIcon ? 'pl-9' : null,
          )}
        />
      </div>
      <FieldDescription>{description}</FieldDescription>
      <FieldErrorText>{errorMessage}</FieldErrorText>
    </TextField>
  )
}
