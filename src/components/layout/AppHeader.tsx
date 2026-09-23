import { Badge } from '@/components/ui/Badge'

export function AppHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-6 lg:px-8">
      <p className="text-sm text-neutral-600">Fieldtrip proposal workspace</p>
      <Badge tone="warning">Sample data · changes are not saved</Badge>
    </header>
  )
}
