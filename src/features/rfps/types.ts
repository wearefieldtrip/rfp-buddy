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

export interface Rfp {
  id: string
  client: string
  opportunity: string
  sector: RfpSector
  status: RfpStatus
  decision: RfpDecision
  outcome: RfpOutcome
  /** `null` when the RFP does not state a deadline; render as "Not found". */
  proposalDeadline: IsoDateString | null
  /** Budget as stated in the RFP. `null` when not stated; render as "Not found". */
  budget: string | null
  /** `null` when no one has been assigned. */
  owner: string | null
  updatedAt: IsoDateString
}

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

export interface RfpWorkspace {
  rfpId: string
  /** `null` when the RFP states no question deadline; render as "Not found". */
  questionDeadline: IsoDateString | null
  serviceAreas: ServiceArea[]
  scopeSummary: string | null
  sourceDocuments: SourceDocument[]
  requirements: RfpRequirement[]
  fitReview: FitReview | null
  /** `null` while `Rfp.decision` is `not_decided`. */
  decisionRecord: DecisionRecord | null
  activity: ActivityEvent[]
}
