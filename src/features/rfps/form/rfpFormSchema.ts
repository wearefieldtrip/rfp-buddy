import { z } from 'zod'
import {
  RFP_DECISIONS,
  RFP_FIELD_LIMITS,
  RFP_SECTORS,
  RFP_STATUSES,
  type RfpDecision,
  type RfpSector,
  type RfpStatus,
} from '@/lib/constants/rfp'
import { SERVICE_AREAS, type ServiceArea } from '@/lib/constants/rfpWorkspace'
import type { Rfp, RfpCreateInput } from '../types'
import { isAllowedStatusDecision, statusDecisionError } from '../workflowRules'

export type RfpFormMode = 'create' | 'edit'

/** Raw form state: text inputs are strings, blank means "not provided". */
export interface RfpFormValues {
  client: string
  opportunity: string
  sector: RfpSector | ''
  status: RfpStatus
  decision: RfpDecision
  proposalDeadline: string
  questionDeadline: string
  budgetMin: string
  budgetMax: string
  budgetNote: string
  owner: string
  serviceAreas: ServiceArea[]
  scopeSummary: string
}

export const RFP_FORM_LABELS: Record<keyof RfpFormValues, string> = {
  client: 'Organization / client',
  opportunity: 'Opportunity title',
  sector: 'Sector',
  status: 'Lifecycle status',
  decision: 'Pursuit decision',
  proposalDeadline: 'Proposal deadline',
  questionDeadline: 'Question deadline',
  budgetMin: 'Budget minimum (USD)',
  budgetMax: 'Budget maximum (USD)',
  budgetNote: 'Budget context / note',
  owner: 'Internal owner',
  serviceAreas: 'Service areas',
  scopeSummary: 'Scope summary',
}

export const EMPTY_RFP_FORM_VALUES: RfpFormValues = {
  client: '',
  opportunity: '',
  sector: '',
  status: 'received',
  decision: 'not_decided',
  proposalDeadline: '',
  questionDeadline: '',
  budgetMin: '',
  budgetMax: '',
  budgetNote: '',
  owner: '',
  serviceAreas: [],
  scopeSummary: '',
}

export function rfpToFormValues(rfp: Rfp): RfpFormValues {
  return {
    client: rfp.client,
    opportunity: rfp.opportunity,
    sector: rfp.sector ?? '',
    status: rfp.status,
    decision: rfp.decision,
    proposalDeadline: rfp.proposalDeadline ?? '',
    questionDeadline: rfp.questionDeadline ?? '',
    budgetMin: rfp.budget.minUsd?.toString() ?? '',
    budgetMax: rfp.budget.maxUsd?.toString() ?? '',
    budgetNote: rfp.budget.note ?? '',
    owner: rfp.owner ?? '',
    serviceAreas: [...rfp.serviceAreas],
    scopeSummary: rfp.scopeSummary ?? '',
  }
}

const L = RFP_FIELD_LIMITS

const requiredText = (label: string, min: number, max: number) =>
  z
    .string()
    .trim()
    .refine((value) => value.length >= min, {
      error: (issue) =>
        issue.input === ''
          ? `Enter the ${label.toLowerCase()}.`
          : `${label} must be at least ${min} characters.`,
    })
    .max(max, `${label} must be ${max} characters or fewer.`)

const optionalText = (label: string, max: number, min = 0) =>
  z
    .string()
    .trim()
    .max(max, `${label} must be ${max} characters or fewer.`)
    .refine((value) => value === '' || value.length >= min, {
      message: `${label} must be at least ${min} characters.`,
    })
    .transform((value) => (value === '' ? null : value))

const optionalDate = (label: string) =>
  z
    .string()
    .trim()
    .refine((value) => value === '' || z.iso.date().safeParse(value).success, {
      message: `Enter the ${label.toLowerCase()} as a valid date.`,
    })
    .transform((value) => (value === '' ? null : value))

const optionalDollars = (label: string) =>
  z
    .string()
    .trim()
    .transform((value) => value.replaceAll(',', ''))
    .refine((value) => value === '' || /^\d+$/.test(value), {
      message: `${label} must be a whole-dollar amount of 0 or more, with no cents.`,
    })
    .transform((value) => (value === '' ? null : Number(value)))
    .refine((value) => value === null || Number.isSafeInteger(value), {
      message: `${label} is too large.`,
    })

export function createRfpFormSchema(mode: RfpFormMode) {
  return z
    .object({
      client: requiredText(RFP_FORM_LABELS.client, L.client.min, L.client.max),
      opportunity: requiredText(RFP_FORM_LABELS.opportunity, L.opportunity.min, L.opportunity.max),
      sector: z
        .union([z.enum(RFP_SECTORS), z.literal('')])
        .transform((value) => (value === '' ? null : value)),
      status: z.enum(RFP_STATUSES),
      decision: z.enum(RFP_DECISIONS),
      proposalDeadline: optionalDate(RFP_FORM_LABELS.proposalDeadline),
      questionDeadline: optionalDate(RFP_FORM_LABELS.questionDeadline),
      budgetMin: optionalDollars('Budget minimum'),
      budgetMax: optionalDollars('Budget maximum'),
      budgetNote: optionalText('Budget context', L.budgetNote.max),
      owner: optionalText(RFP_FORM_LABELS.owner, L.owner.max, L.owner.min),
      serviceAreas: z.array(z.enum(SERVICE_AREAS)),
      scopeSummary: optionalText(RFP_FORM_LABELS.scopeSummary, L.scopeSummary.max),
    })
    .superRefine((values, ctx) => {
      if (
        values.budgetMin !== null &&
        values.budgetMax !== null &&
        values.budgetMax < values.budgetMin
      ) {
        ctx.addIssue({
          code: 'custom',
          path: ['budgetMax'],
          message: 'Budget maximum can’t be lower than the budget minimum.',
        })
      }
      if (!isAllowedStatusDecision(values.status, values.decision)) {
        ctx.addIssue({
          code: 'custom',
          // In edit mode the decision is read-only, so the status is what must change.
          path: [mode === 'create' ? 'decision' : 'status'],
          message: statusDecisionError(values.status, values.decision),
        })
      }
    })
    .transform((values): RfpCreateInput => ({
      client: values.client,
      opportunity: values.opportunity,
      sector: values.sector,
      status: values.status,
      decision: values.decision,
      proposalDeadline: values.proposalDeadline,
      questionDeadline: values.questionDeadline,
      budget: { minUsd: values.budgetMin, maxUsd: values.budgetMax, note: values.budgetNote },
      owner: values.owner,
      serviceAreas: values.serviceAreas,
      scopeSummary: values.scopeSummary,
    }))
}

export type RfpFormSchema = ReturnType<typeof createRfpFormSchema>
