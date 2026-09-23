import { MissingValue } from '@/components/shared/MissingValue'
import { Notice } from '@/components/shared/Notice'
import type { DecisionRecord, Rfp } from '@/features/rfps'
import { NEEDS_REVIEW_LABEL } from '@/lib/constants/rfp'
import { formatDate } from '@/lib/utils/formatDate'
import { RfpDecisionBadge } from '../RfpStatusBadge'
import { Card, FactList, PanelHeading, type Fact } from './WorkspaceLayout'

function ItemList({ items }: { items: readonly string[] }) {
  return (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

function decisionFacts(rfp: Rfp, record: DecisionRecord): Fact[] {
  const facts: Fact[] = [
    { label: 'Decision', value: <RfpDecisionBadge decision={rfp.decision} /> },
    { label: 'Decided by', value: record.decidedBy },
    {
      label: 'Date',
      value: <time dateTime={record.decidedAt}>{formatDate(record.decidedAt)}</time>,
    },
    { label: 'Rationale', value: record.rationale },
  ]
  if (rfp.decision === 'conditional_go' || record.conditions.length > 0) {
    facts.push({
      label: 'Conditions to pursue',
      value:
        record.conditions.length > 0 ? (
          <ItemList items={record.conditions} />
        ) : (
          <MissingValue label={NEEDS_REVIEW_LABEL} />
        ),
    })
  }
  if (rfp.decision === 'needs_internal_input' || record.inputNeeded.length > 0) {
    facts.push({
      label: 'Input needed',
      value:
        record.inputNeeded.length > 0 ? (
          <ItemList items={record.inputNeeded} />
        ) : (
          <MissingValue label={NEEDS_REVIEW_LABEL} />
        ),
    })
  }
  return facts
}

export function DecisionSection({ rfp, record }: { rfp: Rfp; record: DecisionRecord | null }) {
  return (
    <div className="space-y-4">
      <PanelHeading
        title="Decision"
        description="The human go/no-go judgment for this RFP. Only a person records it."
      />
      <Notice title="Read-only">
        Decisions can't be recorded or changed here yet. That arrives with the persisted data layer,
        and will always require a named decision maker.
      </Notice>

      <Card>
        {rfp.decision === 'not_decided' ? (
          <FactList
            facts={[
              { label: 'Decision', value: <RfpDecisionBadge decision={rfp.decision} /> },
              {
                label: 'Rationale',
                value: <MissingValue label={`No decision recorded · ${NEEDS_REVIEW_LABEL}`} />,
              },
            ]}
          />
        ) : !record ? (
          // A decision set at intake has no recorded rationale, maker, or date yet.
          <FactList
            facts={[
              { label: 'Decision', value: <RfpDecisionBadge decision={rfp.decision} /> },
              { label: 'Decided by', value: <MissingValue label={NEEDS_REVIEW_LABEL} /> },
              { label: 'Date', value: <MissingValue label={NEEDS_REVIEW_LABEL} /> },
              { label: 'Rationale', value: <MissingValue label={NEEDS_REVIEW_LABEL} /> },
            ]}
          />
        ) : (
          <FactList facts={decisionFacts(rfp, record)} />
        )}
      </Card>
    </div>
  )
}
