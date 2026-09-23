import { ChevronDown } from '@untitledui/icons'
import {
  Button as AriaButton,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select as AriaSelect,
  SelectValue,
} from 'react-aria-components'
import { cn } from '@/lib/utils/cn'

export interface SelectOption<T extends string> {
  value: T
  label: string
}

export interface SelectProps<T extends string> {
  label: string
  hideLabel?: boolean
  options: readonly SelectOption<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}

export function Select<T extends string>({
  label,
  hideLabel = false,
  options,
  value,
  onChange,
  className,
}: SelectProps<T>) {
  return (
    <AriaSelect
      value={value}
      onChange={(key) => {
        const match = options.find((option) => option.value === key)
        if (match) onChange(match.value)
      }}
      className={cn('flex flex-col gap-1.5', className)}
    >
      <Label className={hideLabel ? 'sr-only' : 'text-sm font-medium text-neutral-700'}>
        {label}
      </Label>
      <AriaButton
        className={cn(
          'flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-neutral-300 bg-white px-3 text-left text-sm text-neutral-900 shadow-xs outline-none',
          'data-focus-visible:border-accent-500 data-focus-visible:ring-2 data-focus-visible:ring-accent-200',
        )}
      >
        <SelectValue className="truncate" />
        <ChevronDown className="size-4 shrink-0 text-neutral-500" aria-hidden="true" />
      </AriaButton>
      <Popover className="w-(--trigger-width) rounded-md border border-neutral-200 bg-white shadow-lg">
        <ListBox className="max-h-72 overflow-auto p-1 outline-none">
          {options.map((option) => (
            <ListBoxItem
              key={option.value}
              id={option.value}
              textValue={option.label}
              className="cursor-pointer rounded-sm px-2.5 py-2 text-sm text-neutral-800 outline-none data-focused:bg-neutral-100 data-selected:font-semibold"
            >
              {option.label}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </AriaSelect>
  )
}
