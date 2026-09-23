import type { Tone } from '@/types/common'

export const RFP_STATUSES = [
  'intake',
  'fit_review',
  'drafting',
  'internal_review',
  'submitted',
  'closed',
] as const
export type RfpStatus = (typeof RFP_STATUSES)[number]

export const RFP_STATUS_LABEL: Record<RfpStatus, string> = {
  intake: 'Intake',
  fit_review: 'Fit review',
  drafting: 'Drafting',
  internal_review: 'Internal review',
  submitted: 'Submitted',
  closed: 'Closed',
}

export const RFP_STATUS_TONE: Record<RfpStatus, Tone> = {
  intake: 'neutral',
  fit_review: 'info',
  drafting: 'info',
  internal_review: 'warning',
  submitted: 'success',
  closed: 'neutral',
}

export const RFP_DECISIONS = ['pending', 'pursue', 'no_go', 'won', 'lost'] as const
export type RfpDecision = (typeof RFP_DECISIONS)[number]

export const RFP_DECISION_LABEL: Record<RfpDecision, string> = {
  pending: 'Pending',
  pursue: 'Pursue',
  no_go: 'No-go',
  won: 'Won',
  lost: 'Lost',
}

export const RFP_DECISION_TONE: Record<RfpDecision, Tone> = {
  pending: 'neutral',
  pursue: 'info',
  no_go: 'warning',
  won: 'success',
  lost: 'danger',
}

export const RFP_SECTORS = ['nonprofit', 'public_health', 'civic'] as const
export type RfpSector = (typeof RFP_SECTORS)[number]

export const RFP_SECTOR_LABEL: Record<RfpSector, string> = {
  nonprofit: 'Nonprofit',
  public_health: 'Public health',
  civic: 'Civic',
}

/** Shown wherever source data is absent. Never replace with a guessed value. */
export const NOT_FOUND_LABEL = 'Not found'
export const NEEDS_REVIEW_LABEL = 'Needs review'
