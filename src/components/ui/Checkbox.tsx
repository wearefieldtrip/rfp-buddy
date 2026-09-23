import { Check } from '@untitledui/icons'
import {
  Checkbox as AriaCheckbox,
  CheckboxGroup as AriaCheckboxGroup,
  type CheckboxProps as AriaCheckboxProps,
} from 'react-aria-components'
import { cn } from '@/lib/utils/cn'
import { FieldDescription, FieldErrorText, FieldLabel } from './Field'

export interface CheckboxGroupOption<T extends string> {
  value: T
  label: string
}

export interface CheckboxGroupProps<T extends string> {
  label: string
  options: readonly CheckboxGroupOption<T>[]
  value: readonly T[]
  onChange: (value: T[]) => void
  description?: string
  errorMessage?: string
  className?: string
}

export function CheckboxGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  description,
  errorMessage,
  className,
}: CheckboxGroupProps<T>) {
  return (
    <AriaCheckboxGroup
      value={[...value]}
      onChange={(next) =>
        onChange(options.filter((option) => next.includes(option.value)).map((o) => o.value))
      }
      isInvalid={Boolean(errorMessage)}
      validationBehavior="aria"
      className={cn('flex flex-col gap-1.5', className)}
    >
      <FieldLabel label={label} elementType="span" />
      <div className="grid gap-x-4 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => (
          <Checkbox key={option.value} value={option.value}>
            {option.label}
          </Checkbox>
        ))}
      </div>
      <FieldDescription>{description}</FieldDescription>
      <FieldErrorText>{errorMessage}</FieldErrorText>
    </AriaCheckboxGroup>
  )
}

export interface CheckboxProps extends Omit<AriaCheckboxProps, 'className' | 'children'> {
  children: string
}

export function Checkbox({ children, ...props }: CheckboxProps) {
  return (
    <AriaCheckbox
      {...props}
      className="group flex cursor-pointer items-center gap-2 text-sm text-neutral-800"
    >
      <span
        aria-hidden="true"
        className={cn(
          'flex size-4 shrink-0 items-center justify-center rounded-sm border border-neutral-400 bg-white',
          'group-data-selected:border-neutral-900 group-data-selected:bg-neutral-900 group-data-selected:text-white',
          'group-data-focus-visible:ring-2 group-data-focus-visible:ring-accent-500 group-data-focus-visible:ring-offset-1',
        )}
      >
        <Check className="hidden size-3 group-data-selected:block" />
      </span>
      {children}
    </AriaCheckbox>
  )
}
