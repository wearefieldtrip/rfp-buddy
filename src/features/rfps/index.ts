export type {
  ActivityEvent,
  DecisionRecord,
  FitDimensionAssessment,
  FitReview,
  Rfp,
  RfpRequirement,
  RfpWorkspace,
  SourceCitation,
  SourceDocument,
} from './types'
export { rfpFixtures, getRfpFixtureById } from './data/rfpFixtures'
export { rfpWorkspaceFixtures, getRfpWorkspaceFixture } from './data/rfpWorkspaceFixtures'
export {
  ALL,
  DEFAULT_RFP_FILTERS,
  filterRfps,
  hasActiveFilters,
  type DecisionFilter,
  type RfpFilterState,
  type StatusFilter,
} from './filterRfps'

export function formatCitation({ document, location }: { document: string; location: string }) {
  return `${document}, ${location}`
}
