import { ArrowLeft, FileSearch02 } from '@untitledui/icons'
import { Navigate, useNavigate, useParams } from 'react-router'
import { PageHeader } from '@/components/layout/PageHeader'
import { RfpOriginBadge } from '@/components/rfp/RfpOriginBadge'
import { RfpDecisionBadge, RfpLifecycleBadges } from '@/components/rfp/RfpStatusBadge'
import { RfpWorkspace } from '@/components/rfp/workspace/RfpWorkspace'
import { EmptyState } from '@/components/shared/EmptyState'
import { Notice } from '@/components/shared/Notice'
import { LinkButton } from '@/components/ui/Button'
import {
  describeRepositoryError,
  isBrowserLocal,
  useRfpData,
  useRfpRepository,
} from '@/features/rfps'
import { isRfpWorkspaceSection } from '@/lib/constants/rfpWorkspace'
import { LOCAL_RECORD_NOTICE } from '@/lib/constants/storage'
import { paths } from '@/routes/paths'

const backLink = (
  <LinkButton href={paths.rfps} variant="ghost" size="sm" className="-ml-3">
    <ArrowLeft className="size-4" aria-hidden="true" />
    Back to pipeline
  </LinkButton>
)

export function RfpDetailPage() {
  const { rfpId = '', section } = useParams()
  const navigate = useNavigate()
  const repository = useRfpRepository()
  const { rfps } = useRfpData()
  const rfp = rfps.find((candidate) => candidate.id === rfpId)

  if (!rfp) {
    return (
      <>
        <PageHeader eyebrow={backLink} title="RFP not found" />
        <div className="rounded-lg border border-neutral-200 bg-white">
          <EmptyState
            icon={<FileSearch02 className="size-6" />}
            title="We couldn't find that RFP"
            description="It may have been removed, reset from this browser, or the link may be incorrect."
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

  if (section !== undefined && !isRfpWorkspaceSection(section)) {
    return <Navigate to={paths.rfpDetail(rfp.id)} replace />
  }

  return (
    <>
      <PageHeader
        eyebrow={backLink}
        title={rfp.opportunity}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <span>{rfp.client}</span>
            <RfpLifecycleBadges status={rfp.status} outcome={rfp.outcome} />
            <RfpDecisionBadge decision={rfp.decision} />
            <RfpOriginBadge rfp={rfp} />
          </span>
        }
      />
      {isBrowserLocal(rfp) ? (
        <Notice title="Stored in this browser" className="mb-6">
          {LOCAL_RECORD_NOTICE}
        </Notice>
      ) : null}
      <RfpWorkspace
        rfp={rfp}
        workspace={repository.getWorkspace(rfp.id)}
        section={section ?? 'overview'}
        // Replace, so Back returns to the pipeline instead of stepping through tabs.
        onSectionChange={(next) => navigate(paths.rfpDetail(rfp.id, next), { replace: true })}
        onSaveOverview={(input) => {
          const result = repository.update(rfp.id, input)
          return result.ok
            ? { ok: true }
            : { ok: false, message: describeRepositoryError(result.error) }
        }}
      />
    </>
  )
}
