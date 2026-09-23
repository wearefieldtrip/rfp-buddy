import {
  RFP_DECISION_LABEL,
  RFP_STATUS_LABEL,
  type RfpDecision,
  type RfpOutcome,
  type RfpStatus,
} from '@/lib/constants/rfp'

// Canonical lifecycle rules. The repository, form validation, UI hints, and
// fixture tests all read from here. Documented in docs/rfp-workflow.md.

export const ALLOWED_DECISIONS_BY_STATUS: Record<RfpStatus, readonly RfpDecision[]> = {
  received: ['not_decided'],
  evaluating: ['not_decided', 'needs_internal_input', 'go', 'conditional_go'],
  pursuing: ['go', 'conditional_go'],
  submitted: ['go', 'conditional_go'],
  closed: ['go', 'conditional_go'],
  declined: ['no_go'],
  withdrawn: ['go', 'conditional_go', 'no_go'],
}

export function isAllowedStatusDecision(status: RfpStatus, decision: RfpDecision): boolean {
  return ALLOWED_DECISIONS_BY_STATUS[status].includes(decision)
}

/**
 * Outcome follows deterministically from status. Closed keeps a recorded won or
 * lost result; anything else closed is unknown. Never invents a result.
 */
export function normalizeOutcome(status: RfpStatus, current: RfpOutcome): RfpOutcome {
  switch (status) {
    case 'received':
    case 'evaluating':
    case 'pursuing':
      return 'not_applicable'
    case 'submitted':
      return 'unknown'
    case 'closed':
      return current === 'won' || current === 'lost' ? current : 'unknown'
    case 'declined':
      return 'declined'
    case 'withdrawn':
      return 'withdrawn'
  }
}

export function describeAllowedDecisions(status: RfpStatus): string {
  const labels = ALLOWED_DECISIONS_BY_STATUS[status].map((d) => RFP_DECISION_LABEL[d])
  return `${RFP_STATUS_LABEL[status]} allows: ${labels.join(', ')}.`
}

export function describeAllowedStatuses(decision: RfpDecision): string {
  const statuses = (Object.keys(ALLOWED_DECISIONS_BY_STATUS) as RfpStatus[]).filter((status) =>
    isAllowedStatusDecision(status, decision),
  )
  return `${RFP_DECISION_LABEL[decision]} allows: ${statuses.map((s) => RFP_STATUS_LABEL[s]).join(', ')}.`
}

export function statusDecisionError(status: RfpStatus, decision: RfpDecision): string {
  return `${RFP_STATUS_LABEL[status]} can't be used with the decision ${RFP_DECISION_LABEL[decision]}.`
}
