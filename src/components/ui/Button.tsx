import {
  Button as AriaButton,
  Link as AriaLink,
  type ButtonProps as AriaButtonProps,
  type LinkProps as AriaLinkProps,
} from 'react-aria-components'
import { cn } from '@/lib/utils/cn'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md'

interface StyleProps {
  variant?: Variant
  size?: Size
  className?: string
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-neutral-900 text-white data-hovered:bg-neutral-800 data-pressed:bg-neutral-950',
  secondary:
    'border border-neutral-300 bg-white text-neutral-800 shadow-xs data-hovered:bg-neutral-50 data-pressed:bg-neutral-100',
  ghost: 'text-neutral-700 data-hovered:bg-neutral-100 data-pressed:bg-neutral-200',
}

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
}

function buttonClasses({ variant = 'primary', size = 'md', className }: StyleProps) {
  return cn(
    'inline-flex cursor-pointer items-center justify-center gap-2 rounded-md font-semibold whitespace-nowrap transition-colors outline-none',
    'data-focus-visible:ring-2 data-focus-visible:ring-accent-500 data-focus-visible:ring-offset-2',
    'data-disabled:cursor-not-allowed data-disabled:opacity-50',
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className,
  )
}

export interface ButtonProps extends Omit<AriaButtonProps, 'className'>, StyleProps {}

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return <AriaButton {...props} className={buttonClasses({ variant, size, className })} />
}

export interface LinkButtonProps extends Omit<AriaLinkProps, 'className'>, StyleProps {}

/** Navigation styled as a button. Use when the action changes the URL. */
export function LinkButton({ variant, size, className, ...props }: LinkButtonProps) {
  return <AriaLink {...props} className={buttonClasses({ variant, size, className })} />
}
