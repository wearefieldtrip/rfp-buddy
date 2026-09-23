import type { Tone } from '@/types/common'

export const RFP_WORKSPACE_SECTIONS = [
  'overview',
  'sources',
  'requirements',
  'fit-review',
  'decision',
  'activity',
  'upcoming',
] as const
export type RfpWorkspaceSection = (typeof RFP_WORKSPACE_SECTIONS)[number]

export const RFP_WORKSPACE_SECTION_LABEL: Record<RfpWorkspaceSection, string> = {
  overview: 'Overview',
  sources: 'Sources',
  requirements: 'Requirements',
  'fit-review': 'Fit review',
  decision: 'Decision',
  activity: 'Activity',
  upcoming: 'Upcoming',
}

export function isRfpWorkspaceSection(value: string): value is RfpWorkspaceSection {
  return (RFP_WORKSPACE_SECTIONS as readonly string[]).includes(value)
}

export const SERVICE_AREAS = [
  'strategy',
  'research',
  'brand',
  'campaign',
  'creative',
  'digital',
  'paid_media',
  'community_engagement',
  'evaluation',
] as const
export type ServiceArea = (typeof SERVICE_AREAS)[number]

export const SERVICE_AREA_LABEL: Record<ServiceArea, string> = {
  strategy: 'Strategy',
  research: 'Research',
  brand: 'Brand',
  campaign: 'Campaign',
  creative: 'Creative',
  digital: 'Digital',
  paid_media: 'Paid media',
  community_engagement: 'Community engagement',
  evaluation: 'Evaluation',
}

export const SOURCE_DOCUMENT_TYPES = ['rfp', 'addendum', 'attachment', 'q_and_a'] as const
export type SourceDocumentType = (typeof SOURCE_DOCUMENT_TYPES)[number]

export const SOURCE_DOCUMENT_TYPE_LABEL: Record<SourceDocumentType, string> = {
  rfp: 'RFP',
  addendum: 'Addendum',
  attachment: 'Attachment',
  q_and_a: 'Q&A',
}

export const REQUIREMENT_TYPES = [
  'submission',
  'format',
  'eligibility',
  'deliverable',
  'evaluation',
  'contractual',
  'clarification',
] as const
export type RequirementType = (typeof REQUIREMENT_TYPES)[number]

export const REQUIREMENT_TYPE_LABEL: Record<RequirementType, string> = {
  submission: 'Submission',
  format: 'Format',
  eligibility: 'Eligibility',
  deliverable: 'Deliverable',
  evaluation: 'Evaluation',
  contractual: 'Contractual',
  clarification: 'Clarification',
}

export const REQUIREMENT_STATUSES = [
  'not_started',
  'in_progress',
  'addressed',
  'at_risk',
  'needs_review',
] as const
export type RequirementStatus = (typeof REQUIREMENT_STATUSES)[number]

export const REQUIREMENT_STATUS_LABEL: Record<RequirementStatus, string> = {
  not_started: 'Not started',
  in_progress: 'In progress',
  addressed: 'Addressed',
  at_risk: 'At risk',
  needs_review: 'Needs review',
}

export const REQUIREMENT_STATUS_TONE: Record<RequirementStatus, Tone> = {
  not_started: 'neutral',
  in_progress: 'info',
  addressed: 'success',
  at_risk: 'danger',
  needs_review: 'warning',
}

/** Fit-review dimensions, in the order they must always be shown. */
export const FIT_DIMENSIONS = ['mission', 'budget', 'scope', 'timeline'] as const
export type FitDimension = (typeof FIT_DIMENSIONS)[number]

export const FIT_DIMENSION_LABEL: Record<FitDimension, string> = {
  mission: 'Mission Alignment',
  budget: 'Budget & Value Health',
  scope: 'Scope & Boundaries',
  timeline: 'Timeline & Capacity',
}

export const FIT_RATINGS = ['strong', 'moderate', 'weak', 'needs_review'] as const
export type FitRating = (typeof FIT_RATINGS)[number]

export const FIT_RATING_LABEL: Record<FitRating, string> = {
  strong: 'Strong',
  moderate: 'Moderate',
  weak: 'Weak',
  needs_review: 'Needs review',
}

export const FIT_RATING_TONE: Record<FitRating, Tone> = {
  strong: 'success',
  moderate: 'warning',
  weak: 'danger',
  needs_review: 'neutral',
}

export const ACTIVITY_TYPES = [
  'rfp_received',
  'owner_assigned',
  'source_reviewed',
  'requirements_extracted',
  'fit_review_completed',
  'decision_recorded',
  'note_added',
] as const
export type ActivityType = (typeof ACTIVITY_TYPES)[number]

export const ACTIVITY_TYPE_LABEL: Record<ActivityType, string> = {
  rfp_received: 'RFP received',
  owner_assigned: 'Owner assigned',
  source_reviewed: 'Source reviewed',
  requirements_extracted: 'Requirements extracted',
  fit_review_completed: 'Fit review completed',
  decision_recorded: 'Decision recorded',
  note_added: 'Note added',
}
