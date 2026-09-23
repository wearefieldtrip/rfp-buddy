import type { RfpDecision, RfpStatus } from '@/lib/constants/rfp'
import type { Rfp } from './types'

export const ALL = 'all'
export type StatusFilter = RfpStatus | typeof ALL
export type DecisionFilter = RfpDecision | typeof ALL

export interface RfpFilterState {
  query: string
  status: StatusFilter
  decision: DecisionFilter
}

export const DEFAULT_RFP_FILTERS: RfpFilterState = {
  query: '',
  status: ALL,
  decision: ALL,
}

export function filterRfps(rfps: readonly Rfp[], filters: RfpFilterState): Rfp[] {
  const query = filters.query.trim().toLowerCase()

  return rfps.filter((rfp) => {
    if (filters.status !== ALL && rfp.status !== filters.status) return false
    if (filters.decision !== ALL && rfp.decision !== filters.decision) return false
    if (!query) return true
    return [rfp.client, rfp.opportunity, rfp.owner ?? ''].some((field) =>
      field.toLowerCase().includes(query),
    )
  })
}

export function hasActiveFilters(filters: RfpFilterState): boolean {
  return filters.query.trim() !== '' || filters.status !== ALL || filters.decision !== ALL
}
