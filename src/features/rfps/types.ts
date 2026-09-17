import { z } from 'zod';

export const RFP_STATUSES = ['new', 'pursuing', 'submitted', 'won', 'lost', 'no_go'] as const;

export const rfpStatusSchema = z.enum(RFP_STATUSES);
export type RfpStatus = z.infer<typeof rfpStatusSchema>;

export const RFP_STATUS_LABELS: Record<RfpStatus, string> = {
  new: 'New',
  pursuing: 'Pursuing',
  submitted: 'Submitted',
  won: 'Won',
  lost: 'Lost',
  no_go: 'No-Go',
};

export const WORK_TYPES = ['campaign', 'branding', 'web', 'other'] as const;

export const workTypeSchema = z.enum(WORK_TYPES);
export type WorkType = z.infer<typeof workTypeSchema>;

export const WORK_TYPE_LABELS: Record<WorkType, string> = {
  campaign: 'Campaign',
  branding: 'Branding',
  web: 'Web',
  other: 'Other',
};

export const createRfpSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  organization_name: z.string().trim().min(1, 'Organization name is required'),
  due_date: z.string().trim().optional(),
  status: rfpStatusSchema,
  work_types: z.array(workTypeSchema),
});

export type CreateRfpInput = z.infer<typeof createRfpSchema>;

export const AI_REVIEW_STATUSES = ['not_scored', 'scoring', 'completed', 'failed'] as const;

export const aiReviewStatusSchema = z.enum(AI_REVIEW_STATUSES);
export type AiReviewStatus = z.infer<typeof aiReviewStatusSchema>;

export const RECOMMENDATIONS = ['Go', 'Conditional Go', 'No-Go'] as const;
export type Recommendation = (typeof RECOMMENDATIONS)[number];

export interface OrgIntelligenceRow {
  signal: string;
  finding: string;
  implication: string;
}

export interface RubricScore {
  dimension: string;
  score: number;
  rationale: string;
}

export interface StrategicRisk {
  risk: string;
  guardrail: string;
}

export interface AiReviewResult {
  recommendation: Recommendation;
  total_score: number;
  executive_summary: string;
  org_intelligence: OrgIntelligenceRow[];
  rubric: RubricScore[];
  risks: StrategicRisk[];
  next_steps: string[];
}

export const QUESTIONS_STATUSES = ['not_generated', 'generating', 'completed', 'failed'] as const;

export const questionsStatusSchema = z.enum(QUESTIONS_STATUSES);
export type QuestionsStatus = z.infer<typeof questionsStatusSchema>;

export interface ClarificationQuestion {
  question: string;
  rationale: string;
}

export interface QuestionsResult {
  questions: ClarificationQuestion[];
}

export interface Rfp {
  id: string;
  title: string;
  organization_name: string;
  due_date: string | null;
  owner_id: string | null;
  status: RfpStatus;
  work_types: WorkType[];
  document_drive_url: string | null;
  document_attached_by: string | null;
  document_attached_at: string | null;
  ai_review_status: AiReviewStatus;
  ai_review_result: AiReviewResult | null;
  ai_review_scored_at: string | null;
  ai_review_error: string | null;
  questions_status: QuestionsStatus;
  questions_result: QuestionsResult | null;
  questions_generated_at: string | null;
  questions_error: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}
