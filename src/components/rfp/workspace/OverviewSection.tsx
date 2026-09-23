import { MissingValue } from '@/components/shared/MissingValue'
import { Notice } from '@/components/shared/Notice'
import { Badge } from '@/components/ui/Badge'
import type { Rfp, RfpWorkspace } from '@/features/rfps'
import { NEEDS_REVIEW_LABEL, NOT_FOUND_LABEL, RFP_SECTOR_LABEL } from '@/lib/constants/rfp'
import { SERVICE_AREA_LABEL } from '@/lib/constants/rfpWorkspace'
import { formatCalendarDate } from '@/lib/utils/formatDate'
import { RfpDecisionBadge, RfpOutcomeBadge, RfpStatusBadge } from '../RfpStatusBadge'
import { Card, FactList, PanelHeading } from './WorkspaceLayout'

interface OverviewSectionProps {
  rfp: Rfp
  workspace: RfpWorkspace | undefined
}

function CalendarDate({ value }: { value: string }) {
  return <time dateTime={value}>{formatCalendarDate(value)}</time>
}

export function OverviewSection({ rfp, workspace }: OverviewSectionProps) {
  // Without a reviewed workspace we can't say whether the source states these
  // facts, so they need review rather than being "not found".
  const questionDeadline = !workspace ? (
    <MissingValue label={NEEDS_REVIEW_LABEL} />
  ) : workspace.questionDeadline ? (
    <CalendarDate value={workspace.questionDeadline} />
  ) : (
    <MissingValue label={NOT_FOUND_LABEL} />
  )

  const serviceAreas =
    workspace && workspace.serviceAreas.length > 0 ? (
      <ul className="flex flex-wrap gap-1.5" aria-label="Service areas">
        {workspace.serviceAreas.map((area) => (
          <li key={area}>
            <Badge>{SERVICE_AREA_LABEL[area]}</Badge>
          </li>
        ))}
      </ul>
    ) : (
      <MissingValue label={NEEDS_REVIEW_LABEL} />
    )

  return (
    <div className="space-y-4">
      <PanelHeading title="Overview" />
      {!workspace ? (
        <Notice title="Workspace details haven't been reviewed yet">
          Only pipeline fields are available for this RFP. Sources, requirements, fit review, and
          activity will appear once someone reviews it.
        </Notice>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Opportunity">
          <FactList
            facts={[
              { label: 'Organization', value: rfp.client },
              { label: 'Opportunity', value: rfp.opportunity },
              { label: 'Sector', value: RFP_SECTOR_LABEL[rfp.sector] },
              {
                label: 'Internal owner',
                value: rfp.owner ?? <MissingValue label={NEEDS_REVIEW_LABEL} />,
              },
            ]}
          />
        </Card>

        <Card title="Status and dates">
          <FactList
            facts={[
              { label: 'Lifecycle status', value: <RfpStatusBadge status={rfp.status} /> },
              { label: 'Pursuit decision', value: <RfpDecisionBadge decision={rfp.decision} /> },
              { label: 'Outcome', value: <RfpOutcomeBadge outcome={rfp.outcome} /> },
              {
                label: 'Proposal deadline',
                value: rfp.proposalDeadline ? (
                  <CalendarDate value={rfp.proposalDeadline} />
                ) : (
                  <MissingValue label={NOT_FOUND_LABEL} />
                ),
              },
              { label: 'Question deadline', value: questionDeadline },
              { label: 'Budget', value: rfp.budget ?? <MissingValue label={NOT_FOUND_LABEL} /> },
            ]}
          />
        </Card>
      </div>

      <Card title="Scope">
        <FactList
          facts={[
            { label: 'Service areas', value: serviceAreas },
            {
              label: 'Scope summary',
              value: workspace?.scopeSummary ?? <MissingValue label={NEEDS_REVIEW_LABEL} />,
            },
          ]}
        />
      </Card>
    </div>
  )
}
