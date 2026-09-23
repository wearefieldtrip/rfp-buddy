import { StatusBadge } from '@/components/shared/StatusBadge'
import {
  RFP_DECISION_LABEL,
  RFP_DECISION_TONE,
  RFP_STATUS_LABEL,
  RFP_STATUS_TONE,
  type RfpDecision,
  type RfpStatus,
} from '@/lib/constants/rfp'

export function RfpStatusBadge({ status }: { status: RfpStatus }) {
  return <StatusBadge tone={RFP_STATUS_TONE[status]} label={RFP_STATUS_LABEL[status]} />
}

export function RfpDecisionBadge({ decision }: { decision: RfpDecision }) {
  return <StatusBadge tone={RFP_DECISION_TONE[decision]} label={RFP_DECISION_LABEL[decision]} />
}
