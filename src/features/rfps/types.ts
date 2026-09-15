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

export interface Rfp {
  id: string;
  title: string;
  organization_name: string;
  due_date: string | null;
  owner_id: string | null;
  status: RfpStatus;
  work_types: WorkType[];
  created_by: string;
  created_at: string;
  updated_at: string;
}
