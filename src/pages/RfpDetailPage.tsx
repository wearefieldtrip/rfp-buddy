import { ArrowLeft, FileSearch02, LayoutAlt01 } from '@untitledui/icons'
import { useParams } from 'react-router'
import { PageHeader } from '@/components/layout/PageHeader'
import { RfpDecisionBadge, RfpStatusBadge } from '@/components/rfp/RfpStatusBadge'
import { DataTablePlaceholder } from '@/components/shared/DataTablePlaceholder'
import { EmptyState } from '@/components/shared/EmptyState'
import { LinkButton } from '@/components/ui/Button'
import { getRfpFixtureById } from '@/features/rfps'
import { paths } from '@/routes/paths'

const backLink = (
  <LinkButton href={paths.rfps} variant="ghost" size="sm" className="-ml-3">
    <ArrowLeft className="size-4" aria-hidden="true" />
    Back to pipeline
  </LinkButton>
)

export function RfpDetailPage() {
  const { rfpId = '' } = useParams()
  const rfp = getRfpFixtureById(rfpId)

  if (!rfp) {
    return (
      <>
        <PageHeader eyebrow={backLink} title="RFP not found" />
        <div className="rounded-lg border border-neutral-200 bg-white">
          <EmptyState
            icon={<FileSearch02 className="size-6" />}
            title="We couldn't find that RFP"
            description="It may have been removed, or the link may be incorrect."
            action={
              <LinkButton href={paths.rfps} variant="secondary">
                View all RFPs
              </LinkButton>
            }
          />
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader
        eyebrow={backLink}
        title={rfp.opportunity}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <span>{rfp.client}</span>
            <RfpStatusBadge status={rfp.status} />
            <RfpDecisionBadge decision={rfp.decision} />
          </span>
        }
      />
      <DataTablePlaceholder
        icon={<LayoutAlt01 className="size-6" />}
        title="RFP workspace coming next"
        description="Requirements, fit assessment, question log, and compliance checks for this opportunity will live here."
      />
    </>
  )
}
