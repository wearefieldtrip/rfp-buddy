import { StatusBadge } from '@/components/shared/StatusBadge'
import {
  RFP_DECISION_LABEL,
  RFP_DECISION_TONE,
  RFP_OUTCOME_LABEL,
  RFP_OUTCOME_TONE,
  RFP_STATUS_LABEL,
  RFP_STATUS_TONE,
  type RfpDecision,
  type RfpOutcome,
  type RfpStatus,
} from '@/lib/constants/rfp'

export function RfpStatusBadge({ status }: { status: RfpStatus }) {
  return <StatusBadge tone={RFP_STATUS_TONE[status]} label={RFP_STATUS_LABEL[status]} />
}

export function RfpDecisionBadge({ decision }: { decision: RfpDecision }) {
  return <StatusBadge tone={RFP_DECISION_TONE[decision]} label={RFP_DECISION_LABEL[decision]} />
}

export function RfpOutcomeBadge({ outcome }: { outcome: RfpOutcome }) {
  return <StatusBadge tone={RFP_OUTCOME_TONE[outcome]} label={RFP_OUTCOME_LABEL[outcome]} />
}

/**
 * Lifecycle status, plus the outcome for closed RFPs. For declined and withdrawn
 * RFPs the outcome repeats the status, so it's omitted.
 */
export function RfpLifecycleBadges({
  status,
  outcome,
}: {
  status: RfpStatus
  outcome: RfpOutcome
}) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <RfpStatusBadge status={status} />
      {status === 'closed' ? <RfpOutcomeBadge outcome={outcome} /> : null}
    </span>
  )
}
