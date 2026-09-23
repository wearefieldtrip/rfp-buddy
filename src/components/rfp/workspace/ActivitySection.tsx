import { ClockRewind } from '@untitledui/icons'
import { EmptyState } from '@/components/shared/EmptyState'
import { Notice } from '@/components/shared/Notice'
import { Badge } from '@/components/ui/Badge'
import type { ActivityEvent } from '@/features/rfps'
import { ACTIVITY_TYPE_LABEL } from '@/lib/constants/rfpWorkspace'
import { formatDateTime } from '@/lib/utils/formatDate'
import { Card, PanelHeading } from './WorkspaceLayout'

export function ActivitySection({ events }: { events: readonly ActivityEvent[] }) {
  const newestFirst = [...events].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))

  return (
    <div className="space-y-4">
      <PanelHeading
        title="Activity"
        description="What people have done on this RFP, newest first."
      />
      <Notice tone="warning" title="Static fixture history">
        These entries are sample data for the prototype, not a live audit log. Real activity will be
        recorded automatically once changes are persisted.
      </Notice>

      <Card>
        {newestFirst.length === 0 ? (
          <EmptyState
            icon={<ClockRewind className="size-6" />}
            title="No activity recorded"
            description="Nothing has been logged for this RFP yet."
          />
        ) : (
          <ol aria-label="Activity history" className="divide-y divide-neutral-200">
            {newestFirst.map((event) => (
              <li key={event.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-4">
                <div className="shrink-0 sm:w-44">
                  <Badge>{ACTIVITY_TYPE_LABEL[event.type]}</Badge>
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-neutral-900">{event.description}</p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {event.actor} ·{' '}
                    <time dateTime={event.occurredAt}>{formatDateTime(event.occurredAt)}</time>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </Card>
    </div>
  )
}
