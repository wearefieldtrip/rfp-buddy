import type { Tone } from '@/types/common'

/** Lifecycle state: where the RFP is in Fieldtrip's process. */
export const RFP_STATUSES = [
  'received',
  'evaluating',
  'pursuing',
  'submitted',
  'closed',
  'declined',
  'withdrawn',
] as const
export type RfpStatus = (typeof RFP_STATUSES)[number]

export const RFP_STATUS_LABEL: Record<RfpStatus, string> = {
  received: 'Received',
  evaluating: 'Evaluating',
  pursuing: 'Pursuing',
  submitted: 'Submitted',
  closed: 'Closed',
  declined: 'Declined',
  withdrawn: 'Withdrawn',
}

export const RFP_STATUS_TONE: Record<RfpStatus, Tone> = {
  received: 'neutral',
  evaluating: 'info',
  pursuing: 'info',
  submitted: 'success',
  closed: 'neutral',
  declined: 'neutral',
  withdrawn: 'neutral',
}

/** Human go/no-go judgment. Only a person sets this. */
export const RFP_DECISIONS = [
  'not_decided',
  'go',
  'conditional_go',
  'no_go',
  'needs_internal_input',
] as const
export type RfpDecision = (typeof RFP_DECISIONS)[number]

export const RFP_DECISION_LABEL: Record<RfpDecision, string> = {
  not_decided: 'Not decided',
  go: 'Go',
  conditional_go: 'Conditional Go',
  no_go: 'No-Go',
  needs_internal_input: 'Needs Internal Input',
}

export const RFP_DECISION_TONE: Record<RfpDecision, Tone> = {
  not_decided: 'neutral',
  go: 'success',
  conditional_go: 'info',
  no_go: 'danger',
  needs_internal_input: 'warning',
}

/** Final disposition of the opportunity. */
export const RFP_OUTCOMES = [
  'won',
  'lost',
  'declined',
  'withdrawn',
  'unknown',
  'not_applicable',
] as const
export type RfpOutcome = (typeof RFP_OUTCOMES)[number]

export const RFP_OUTCOME_LABEL: Record<RfpOutcome, string> = {
  won: 'Won',
  lost: 'Lost',
  declined: 'Declined',
  withdrawn: 'Withdrawn',
  unknown: 'Unknown',
  not_applicable: 'Not applicable',
}

export const RFP_OUTCOME_TONE: Record<RfpOutcome, Tone> = {
  won: 'success',
  lost: 'danger',
  declined: 'neutral',
  withdrawn: 'neutral',
  unknown: 'warning',
  not_applicable: 'neutral',
}

export const RFP_SECTORS = ['nonprofit', 'public_health', 'civic'] as const
export type RfpSector = (typeof RFP_SECTORS)[number]

export const RFP_SECTOR_LABEL: Record<RfpSector, string> = {
  nonprofit: 'Nonprofit',
  public_health: 'Public health',
  civic: 'Civic',
}

/** The source does not state the value. Never replace with a guessed value. */
export const NOT_FOUND_LABEL = 'Not found'
/** A person has not yet provided or confirmed the value. */
export const NEEDS_REVIEW_LABEL = 'Needs review'
export const UNASSIGNED_LABEL = 'Unassigned'
