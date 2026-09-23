import { FileSearch02, Inbox01, Plus } from '@untitledui/icons'
import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { RfpFilters } from '@/components/rfp/RfpFilters'
import { RfpPipelineTable } from '@/components/rfp/RfpPipelineTable'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button, LinkButton } from '@/components/ui/Button'
import {
  DEFAULT_RFP_FILTERS,
  filterRfps,
  rfpFixtures,
  type Rfp,
  type RfpFilterState,
} from '@/features/rfps'
import { paths } from '@/routes/paths'

function pluralize(count: number) {
  return `${count} ${count === 1 ? 'RFP' : 'RFPs'}`
}

interface RfpPipelinePageProps {
  rfps?: readonly Rfp[]
}

export function RfpPipelinePage({ rfps = rfpFixtures }: RfpPipelinePageProps) {
  const [filters, setFilters] = useState<RfpFilterState>(DEFAULT_RFP_FILTERS)

  const visibleRfps = useMemo(
    () => filterRfps(rfps, filters).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [rfps, filters],
  )

  const resetFilters = () => setFilters(DEFAULT_RFP_FILTERS)
  const newRfpButton = (
    <LinkButton href={paths.newRfp}>
      <Plus className="size-5" aria-hidden="true" />
      New RFP
    </LinkButton>
  )

  const summary =
    visibleRfps.length === rfps.length
      ? `${pluralize(rfps.length)} in the pipeline`
      : `Showing ${visibleRfps.length} of ${pluralize(rfps.length)}`

  return (
    <>
      <PageHeader
        title="RFP Pipeline"
        description="Track every opportunity from intake through outcome."
        actions={newRfpButton}
      />

      {rfps.length === 0 ? (
        <div className="rounded-lg border border-neutral-200 bg-white">
          <EmptyState
            icon={<Inbox01 className="size-6" />}
            title="No RFPs yet"
            description="Add the first opportunity to start tracking fit, deadlines, and decisions."
            action={newRfpButton}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <RfpFilters filters={filters} onChange={setFilters} onReset={resetFilters} />

          <p role="status" className="text-sm text-neutral-600">
            {summary}
          </p>

          {visibleRfps.length > 0 ? (
            <RfpPipelineTable rfps={visibleRfps} />
          ) : (
            <div className="rounded-lg border border-neutral-200 bg-white">
              <EmptyState
                icon={<FileSearch02 className="size-6" />}
                title="No RFPs match these filters"
                description="Try a different search term or clear the filters to see the full pipeline."
                action={
                  <Button variant="secondary" onPress={resetFilters}>
                    Clear filters
                  </Button>
                }
              />
            </div>
          )}
        </div>
      )}
    </>
  )
}
