export type {
  ActivityEvent,
  DecisionRecord,
  FitDimensionAssessment,
  FitReview,
  Rfp,
  RfpBudget,
  RfpCreateInput,
  RfpDataOrigin,
  RfpFields,
  RfpRequirement,
  RfpUpdateInput,
  RfpWorkspace,
  SourceCitation,
  SourceDocument,
} from './types'
export { rfpFixtures } from './data/rfpFixtures'
export { rfpWorkspaceFixtures } from './data/rfpWorkspaceFixtures'
export {
  ALL,
  DEFAULT_RFP_FILTERS,
  filterRfps,
  hasActiveFilters,
  type DecisionFilter,
  type RfpFilterState,
  type StatusFilter,
} from './filterRfps'
export { formatBudgetAmount } from './formatBudget'
export { getRfpOriginKind, isBrowserLocal } from './origin'
export {
  ALLOWED_DECISIONS_BY_STATUS,
  describeAllowedDecisions,
  describeAllowedStatuses,
  isAllowedStatusDecision,
  normalizeOutcome,
} from './workflowRules'
export {
  createRfpRepository,
  describeRepositoryError,
  type LocalDataSummary,
  type RepositoryError,
  type RepositoryResult,
  type RfpRepository,
  type RfpRepositorySnapshot,
} from './repository/rfpRepository'
export {
  getBrowserStorage,
  type LocalStoreStatus,
  type StorageLike,
} from './repository/localRfpStore'
export { RfpRepositoryProvider } from './repository/RfpRepositoryProvider'
export { useRfpData, useRfpRepository } from './repository/useRfpRepository'
export {
  createRfpFormSchema,
  EMPTY_RFP_FORM_VALUES,
  RFP_FORM_LABELS,
  rfpToFormValues,
  type RfpFormMode,
  type RfpFormValues,
} from './form/rfpFormSchema'

export function formatCitation({ document, location }: { document: string; location: string }) {
  return `${document}, ${location}`
}
