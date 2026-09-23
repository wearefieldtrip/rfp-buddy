import type { RfpDecision, RfpOutcome, RfpSector, RfpStatus } from '@/lib/constants/rfp'
import type {
  ActivityType,
  FitDimension,
  FitRating,
  RequirementStatus,
  RequirementType,
  ServiceArea,
  SourceDocumentType,
} from '@/lib/constants/rfpWorkspace'
import type { IsoDateString } from '@/types/common'

export interface RfpBudget {
  /** Whole US dollars. `null` when the source doesn't state it. */
  minUsd: number | null
  maxUsd: number | null
  /** Context such as "Over 3 years". */
  note: string | null
}

/** The fields every RFP record carries, whether built-in or stored locally. */
export interface RfpFields {
  id: string
  client: string
  opportunity: string
  /** `null` until someone selects it; render as "Needs review". */
  sector: RfpSector | null
  status: RfpStatus
  decision: RfpDecision
  outcome: RfpOutcome
  /** `null` when the RFP states no deadline; render as "Not found". */
  proposalDeadline: IsoDateString | null
  /** `null` when the RFP states no question deadline; render as "Not found". */
  questionDeadline: IsoDateString | null
  budget: RfpBudget
  /** `null` until someone is assigned. */
  owner: string | null
  serviceAreas: ServiceArea[]
  scopeSummary: string | null
  updatedAt: IsoDateString
}

export type RfpDataOrigin = 'fixture' | 'local'

/** An RFP as the app sees it, after built-in fixtures and browser-local data are merged. */
export interface Rfp extends RfpFields {
  dataOrigin: RfpDataOrigin
  /** True for a built-in fixture that has a local override. Always false for local records. */
  isLocallyEdited: boolean
}

/** Fields a person can set when creating an RFP. Outcome is derived. */
export type RfpCreateInput = Omit<RfpFields, 'id' | 'outcome' | 'updatedAt'>

/** Fields a person can change from the Overview tab. Decision is owned by the Decision tab. */
export type RfpUpdateInput = Omit<RfpCreateInput, 'decision'>

/** Where a fact came from, e.g. document "RFP", location "p. 8, Evaluation Criteria". */
export interface SourceCitation {
  document: string
  location: string
}

export interface SourceDocument {
  id: string
  name: string
  type: SourceDocumentType
  /** Issue or received date. `null` when the document is undated. */
  date: IsoDateString | null
  /** Where the file came from. A reference only, not a link. */
  sourceReference: string
}

export interface RfpRequirement {
  id: string
  requirement: string
  type: RequirementType
  citation: SourceCitation
  owner: string | null
  status: RequirementStatus
  notes: string | null
}

export interface FitDimensionAssessment {
  rating: FitRating
  summary: string
  evidence: string[]
  risks: string[]
  unknowns: string[]
  conditions: string[]
}

export interface FitReview {
  reviewedBy: string
  reviewedAt: IsoDateString
  dimensions: Record<FitDimension, FitDimensionAssessment>
}

/** Details behind `Rfp.decision`. The decision value itself lives only on `Rfp`. */
export interface DecisionRecord {
  rationale: string
  decidedBy: string
  decidedAt: IsoDateString
  /** Required for Conditional Go. */
  conditions: string[]
  /** Required for Needs Internal Input. */
  inputNeeded: string[]
}

export interface ActivityEvent {
  id: string
  type: ActivityType
  description: string
  actor: string
  occurredAt: IsoDateString
}

/** Read-only review detail for an RFP. Fixture-only in this release. */
export interface RfpWorkspace {
  rfpId: string
  sourceDocuments: SourceDocument[]
  requirements: RfpRequirement[]
  fitReview: FitReview | null
  /** `null` while `Rfp.decision` is `not_decided`. */
  decisionRecord: DecisionRecord | null
  activity: ActivityEvent[]
}
