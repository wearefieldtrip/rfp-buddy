import { TextArea as AriaTextArea, TextField, type TextFieldProps } from 'react-aria-components'
import { cn } from '@/lib/utils/cn'
import { FieldDescription, FieldErrorText, FieldLabel } from './Field'
import { controlClasses, focusRingClasses } from './fieldStyles'

export interface TextAreaProps extends Omit<
  TextFieldProps,
  'className' | 'children' | 'isInvalid' | 'validationBehavior'
> {
  label: string
  description?: string
  errorMessage?: string
  rows?: number
  className?: string
}

export function TextArea({
  label,
  description,
  errorMessage,
  rows = 4,
  className,
  ...props
}: TextAreaProps) {
  return (
    <TextField
      {...props}
      validationBehavior="aria"
      isInvalid={Boolean(errorMessage)}
      className={cn('flex flex-col gap-1.5', className)}
    >
      <FieldLabel label={label} isRequired={props.isRequired} />
      <AriaTextArea rows={rows} className={cn(controlClasses, focusRingClasses, 'px-3 py-2')} />
      <FieldDescription>{description}</FieldDescription>
      <FieldErrorText>{errorMessage}</FieldErrorText>
    </TextField>
  )
}
