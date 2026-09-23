import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Controller, useForm, useWatch, type FieldErrors } from 'react-hook-form'
import { Notice } from '@/components/shared/Notice'
import { Button } from '@/components/ui/Button'
import { CheckboxGroup } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { Select, type SelectOption } from '@/components/ui/Select'
import { TextArea } from '@/components/ui/TextArea'
import {
  createRfpFormSchema,
  describeAllowedDecisions,
  describeAllowedStatuses,
  RFP_FORM_LABELS,
  type RfpCreateInput,
  type RfpFormMode,
  type RfpFormValues,
} from '@/features/rfps'
import {
  RFP_DECISION_LABEL,
  RFP_DECISIONS,
  RFP_FIELD_LIMITS,
  RFP_SECTOR_LABEL,
  RFP_SECTORS,
  RFP_STATUS_LABEL,
  RFP_STATUSES,
  type RfpSector,
} from '@/lib/constants/rfp'
import { SERVICE_AREA_LABEL, SERVICE_AREAS } from '@/lib/constants/rfpWorkspace'
import { RfpDecisionBadge } from './RfpStatusBadge'

export type RfpFormSaveOutcome = { ok: true } | { ok: false; message: string }

interface RfpFormProps {
  mode: RfpFormMode
  defaultValues: RfpFormValues
  onSubmit: (input: RfpCreateInput) => RfpFormSaveOutcome
  onCancel: () => void
}

const NO_SECTOR = 'none'
const SECTOR_OPTIONS: SelectOption<RfpSector | typeof NO_SECTOR>[] = [
  { value: NO_SECTOR, label: 'Not selected' },
  ...RFP_SECTORS.map((sector) => ({ value: sector, label: RFP_SECTOR_LABEL[sector] })),
]
const STATUS_OPTIONS = RFP_STATUSES.map((status) => ({
  value: status,
  label: RFP_STATUS_LABEL[status],
}))
const DECISION_OPTIONS = RFP_DECISIONS.map((decision) => ({
  value: decision,
  label: RFP_DECISION_LABEL[decision],
}))
const SERVICE_AREA_OPTIONS = SERVICE_AREAS.map((area) => ({
  value: area,
  label: SERVICE_AREA_LABEL[area],
}))

/** Field order for the error summary; matches the on-screen order. */
const FIELD_ORDER: (keyof RfpFormValues)[] = [
  'client',
  'opportunity',
  'sector',
  'status',
  'decision',
  'proposalDeadline',
  'questionDeadline',
  'budgetMin',
  'budgetMax',
  'budgetNote',
  'owner',
  'serviceAreas',
  'scopeSummary',
]

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="rounded-lg border border-neutral-200 bg-white p-5 shadow-xs">
      <legend className="px-1 text-base font-semibold text-neutral-900">{title}</legend>
      <div className="mt-2 grid gap-4 md:grid-cols-2">{children}</div>
    </fieldset>
  )
}

export function RfpForm({ mode, defaultValues, onSubmit, onCancel }: RfpFormProps) {
  const schema = useMemo(() => createRfpFormSchema(mode), [mode])
  const {
    control,
    handleSubmit,
    formState: { errors, submitCount, isSubmitting },
  } = useForm<RfpFormValues, unknown, RfpCreateInput>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldFocusError: false,
  })
  const status = useWatch({ control, name: 'status' })
  const decision = useWatch({ control, name: 'decision' })
  const scopeSummary = useWatch({ control, name: 'scopeSummary' })

  const [saveError, setSaveError] = useState<string | null>(null)
  const focusSummaryPending = useRef(false)
  const summaryRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // React Hook Form commits errors and submitCount across renders, so focus the
  // summary on whichever render first shows it after an invalid submit.
  useEffect(() => {
    if (focusSummaryPending.current && summaryRef.current) {
      focusSummaryPending.current = false
      summaryRef.current.focus()
    }
  })

  const fieldId = (name: keyof RfpFormValues) => `rfp-${mode}-${name}`

  const focusField = (name: keyof RfpFormValues) => {
    const container = formRef.current?.querySelector(`#${fieldId(name)}`)
    container?.querySelector<HTMLElement>('input, textarea, button')?.focus()
  }

  const submit = (event: FormEvent<HTMLFormElement>) =>
    handleSubmit(
      (input) => {
        setSaveError(null)
        const outcome = onSubmit(input)
        if (!outcome.ok) setSaveError(outcome.message)
      },
      () => {
        setSaveError(null)
        focusSummaryPending.current = true
      },
    )(event)

  const errorEntries = FIELD_ORDER.flatMap((name) => {
    const message = (errors as FieldErrors<RfpFormValues>)[name]?.message
    return typeof message === 'string' ? [{ name, message }] : []
  })
  const errorFor = (name: keyof RfpFormValues) => {
    const message = errors[name]?.message
    return typeof message === 'string' ? message : undefined
  }

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={(event) => void submit(event)}
      aria-label={mode === 'create' ? 'New RFP intake' : 'Edit overview'}
      className="space-y-5"
    >
      {submitCount > 0 && errorEntries.length > 0 ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          aria-labelledby={`rfp-${mode}-error-summary`}
          className="rounded-lg border border-danger-200 bg-danger-50 p-4 text-sm text-danger-700 outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
        >
          <h2 id={`rfp-${mode}-error-summary`} className="font-semibold">
            {errorEntries.length === 1
              ? 'Fix 1 problem before saving'
              : `Fix ${errorEntries.length} problems before saving`}
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {errorEntries.map(({ name, message }) => (
              <li key={name}>
                <a
                  href={`#${fieldId(name)}`}
                  onClick={(event) => {
                    event.preventDefault()
                    focusField(name)
                  }}
                  className="underline underline-offset-2"
                >
                  {RFP_FORM_LABELS[name]}: {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {saveError ? (
        <Notice tone="warning" role="alert" title="Couldn’t save">
          {saveError}
        </Notice>
      ) : null}

      <p className="text-sm text-neutral-600">
        Fields marked <span aria-hidden="true">*</span>
        <span className="sr-only">with an asterisk</span> are required. Leave anything you don’t
        know blank rather than guessing.
      </p>

      <Section title="Opportunity">
        <div id={fieldId('client')}>
          <Controller
            control={control}
            name="client"
            render={({ field }) => (
              <Input
                label={RFP_FORM_LABELS.client}
                isRequired
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                errorMessage={errorFor('client')}
              />
            )}
          />
        </div>
        <div id={fieldId('opportunity')}>
          <Controller
            control={control}
            name="opportunity"
            render={({ field }) => (
              <Input
                label={RFP_FORM_LABELS.opportunity}
                isRequired
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                errorMessage={errorFor('opportunity')}
              />
            )}
          />
        </div>
        <div id={fieldId('sector')}>
          <Controller
            control={control}
            name="sector"
            render={({ field }) => (
              <Select
                label={RFP_FORM_LABELS.sector}
                options={SECTOR_OPTIONS}
                value={field.value === '' ? NO_SECTOR : field.value}
                onChange={(value) => field.onChange(value === NO_SECTOR ? '' : value)}
                errorMessage={errorFor('sector')}
              />
            )}
          />
        </div>
      </Section>

      <Section title="Status">
        <div id={fieldId('status')}>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select
                label={RFP_FORM_LABELS.status}
                isRequired
                options={STATUS_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                description={mode === 'edit' ? describeAllowedStatuses(decision) : undefined}
                errorMessage={errorFor('status')}
              />
            )}
          />
        </div>
        <div id={fieldId('decision')}>
          {mode === 'create' ? (
            <Controller
              control={control}
              name="decision"
              render={({ field }) => (
                <Select
                  label={RFP_FORM_LABELS.decision}
                  isRequired
                  options={DECISION_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  description={describeAllowedDecisions(status)}
                  errorMessage={errorFor('decision')}
                />
              )}
            />
          ) : (
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-neutral-700">
                {RFP_FORM_LABELS.decision}
              </span>
              <span>
                <RfpDecisionBadge decision={decision} />
              </span>
              <span className="text-xs text-neutral-600">
                Managed on the Decision tab. It can’t be changed here.
              </span>
            </div>
          )}
        </div>
      </Section>

      <Section title="Dates and budget">
        {(['proposalDeadline', 'questionDeadline'] as const).map((name) => (
          <div key={name} id={fieldId(name)}>
            <Controller
              control={control}
              name={name}
              render={({ field }) => (
                <Input
                  type="date"
                  label={RFP_FORM_LABELS[name]}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  description="Leave blank if the RFP doesn’t state one."
                  errorMessage={errorFor(name)}
                />
              )}
            />
          </div>
        ))}
        {(['budgetMin', 'budgetMax'] as const).map((name) => (
          <div key={name} id={fieldId(name)}>
            <Controller
              control={control}
              name={name}
              render={({ field }) => (
                <Input
                  inputMode="numeric"
                  label={RFP_FORM_LABELS[name]}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  description="Whole dollars, e.g. 250000. Leave blank if not stated."
                  errorMessage={errorFor(name)}
                />
              )}
            />
          </div>
        ))}
        <div id={fieldId('budgetNote')} className="md:col-span-2">
          <Controller
            control={control}
            name="budgetNote"
            render={({ field }) => (
              <Input
                label={RFP_FORM_LABELS.budgetNote}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                description={`For example “Over 3 years”. Up to ${RFP_FIELD_LIMITS.budgetNote.max} characters.`}
                errorMessage={errorFor('budgetNote')}
              />
            )}
          />
        </div>
      </Section>

      <Section title="Ownership and scope">
        <div id={fieldId('owner')}>
          <Controller
            control={control}
            name="owner"
            render={({ field }) => (
              <Input
                label={RFP_FORM_LABELS.owner}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                errorMessage={errorFor('owner')}
              />
            )}
          />
        </div>
        <div id={fieldId('serviceAreas')} className="md:col-span-2">
          <Controller
            control={control}
            name="serviceAreas"
            render={({ field }) => (
              <CheckboxGroup
                label={RFP_FORM_LABELS.serviceAreas}
                options={SERVICE_AREA_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                errorMessage={errorFor('serviceAreas')}
              />
            )}
          />
        </div>
        <div id={fieldId('scopeSummary')} className="md:col-span-2">
          <Controller
            control={control}
            name="scopeSummary"
            render={({ field }) => (
              <TextArea
                label={RFP_FORM_LABELS.scopeSummary}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                description={`${scopeSummary.length} of ${RFP_FIELD_LIMITS.scopeSummary.max} characters`}
                errorMessage={errorFor('scopeSummary')}
              />
            )}
          />
        </div>
      </Section>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" isDisabled={isSubmitting}>
          Save RFP locally
        </Button>
        <Button variant="secondary" onPress={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
