import { FieldError, Label, Text } from 'react-aria-components'

// Shared label, help text, and error parts so every form control reads the same way.

export function FieldLabel({
  label,
  hideLabel = false,
  isRequired = false,
  elementType,
}: {
  label: string
  hideLabel?: boolean
  isRequired?: boolean
  /** Use "span" inside groups where a <label> element isn't valid. */
  elementType?: 'label' | 'span'
}) {
  return (
    <Label
      elementType={elementType}
      className={hideLabel ? 'sr-only' : 'text-sm font-medium text-neutral-700'}
    >
      {label}
      {isRequired ? (
        <span aria-hidden="true" className="text-danger-700">
          {' '}
          *
        </span>
      ) : null}
    </Label>
  )
}

export function FieldDescription({ children }: { children?: string }) {
  return children ? (
    <Text slot="description" className="text-xs text-neutral-600">
      {children}
    </Text>
  ) : null
}

export function FieldErrorText({ children }: { children?: string }) {
  return <FieldError className="text-xs font-medium text-danger-700">{children}</FieldError>
}
