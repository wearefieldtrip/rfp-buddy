import {
  Tab as AriaTab,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  Tabs as AriaTabs,
  type TabListProps as AriaTabListProps,
  type TabPanelProps as AriaTabPanelProps,
  type TabProps as AriaTabProps,
  type TabsProps as AriaTabsProps,
} from 'react-aria-components'
import { cn } from '@/lib/utils/cn'

export interface TabsProps extends Omit<AriaTabsProps, 'className'> {
  className?: string
}

export function Tabs({ className, ...props }: TabsProps) {
  return <AriaTabs {...props} className={cn('flex flex-col', className)} />
}

export interface TabListProps<T extends object> extends Omit<AriaTabListProps<T>, 'className'> {
  className?: string
}

/** Scrolls horizontally when the tabs don't fit. */
export function TabList<T extends object>({ className, ...props }: TabListProps<T>) {
  return (
    <div className="overflow-x-auto border-b border-neutral-200">
      <AriaTabList {...props} className={cn('flex gap-1', className)} />
    </div>
  )
}

export interface TabProps extends Omit<AriaTabProps, 'className'> {
  className?: string
}

export function Tab({ className, ...props }: TabProps) {
  return (
    <AriaTab
      {...props}
      className={cn(
        '-mb-px cursor-pointer border-b-2 border-transparent px-3 py-2.5 text-sm font-semibold whitespace-nowrap text-neutral-600 outline-none',
        'data-hovered:text-neutral-900',
        'data-selected:border-neutral-900 data-selected:text-neutral-900',
        'data-focus-visible:rounded-t-md data-focus-visible:ring-2 data-focus-visible:ring-accent-500 data-focus-visible:ring-inset',
        className,
      )}
    />
  )
}

export interface TabPanelProps extends Omit<AriaTabPanelProps, 'className'> {
  className?: string
}

export function TabPanel({ className, ...props }: TabPanelProps) {
  return (
    <AriaTabPanel
      {...props}
      className={cn(
        'pt-6 outline-none data-focus-visible:rounded-md data-focus-visible:ring-2 data-focus-visible:ring-accent-500',
        className,
      )}
    />
  )
}
