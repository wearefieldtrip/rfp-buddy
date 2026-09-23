import { ArrowLeft, InfoCircle } from '@untitledui/icons'
import { PageHeader } from '@/components/layout/PageHeader'
import { LinkButton } from '@/components/ui/Button'
import { paths } from '@/routes/paths'

const PLANNED_INTAKE_FIELDS = [
  { name: 'Client and opportunity', detail: 'Who issued the RFP and what it is for.' },
  { name: 'Original RFP document', detail: 'Linked from Google Drive; never copied into the app.' },
  { name: 'Proposal deadline', detail: 'Extracted for review; shown as "Not found" if absent.' },
  { name: 'Budget', detail: 'As stated in the RFP; shown as "Not found" if absent.' },
  { name: 'Owner', detail: 'The Fieldtrip team member responsible for the decision.' },
]

export function NewRfpPage() {
  return (
    <>
      <PageHeader
        eyebrow={
          <LinkButton href={paths.rfps} variant="ghost" size="sm" className="-ml-3">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to pipeline
          </LinkButton>
        }
        title="New RFP"
        description="Preview of the upcoming intake flow."
      />

      <div className="max-w-2xl space-y-6">
        <div
          role="note"
          className="flex gap-3 rounded-lg border border-warning-200 bg-warning-50 p-4 text-sm text-warning-700"
        >
          <InfoCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">RFP intake is not available yet</p>
            <p className="mt-1">
              This page is a static preview. Nothing here is saved, and no RFP will be created.
            </p>
          </div>
        </div>

        <section
          aria-labelledby="planned-fields-heading"
          className="rounded-lg border border-neutral-200 bg-white p-6"
        >
          <h2 id="planned-fields-heading" className="text-base font-semibold text-neutral-900">
            What intake will capture
          </h2>
          <dl className="mt-4 divide-y divide-neutral-200">
            {PLANNED_INTAKE_FIELDS.map((field) => (
              <div key={field.name} className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-neutral-900">{field.name}</dt>
                <dd className="mt-1 text-sm text-neutral-600 sm:col-span-2 sm:mt-0">
                  {field.detail}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </>
  )
}
