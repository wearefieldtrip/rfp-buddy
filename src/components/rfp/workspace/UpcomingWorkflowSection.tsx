import { Badge } from '@/components/ui/Badge'
import { PanelHeading } from './WorkspaceLayout'

const UPCOMING = [
  {
    title: 'Questions',
    description:
      'A clarification-question log for this RFP: draft questions, approve each one internally, then track the issuer’s answers against the question deadline.',
    deferred:
      'Sending questions to the issuer is deferred. Nothing is sent from RFP Buddy, and sending will always need explicit human confirmation.',
  },
  {
    title: 'Proposal',
    description:
      'A response outline built from the requirements, with sections drawing only on content-library items approved for reuse.',
    deferred:
      'Google Docs and Slides generation is deferred. Creating or changing any document will always need explicit human confirmation.',
  },
  {
    title: 'Compliance',
    description:
      'A pre-submission checklist that maps every requirement to evidence and ends with human sign-off before submission approval.',
    deferred:
      'Compliance checks are deferred until requirements and proposal drafts are saved in RFP Buddy.',
  },
] as const

export function UpcomingWorkflowSection() {
  return (
    <div className="space-y-4">
      <PanelHeading
        title="Upcoming workflow"
        description="Planned parts of the workspace. None of them work yet."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {UPCOMING.map((item) => (
          <section
            key={item.title}
            aria-label={item.title}
            className="rounded-lg border border-dashed border-neutral-300 bg-white p-5"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-neutral-900">{item.title}</h3>
              <Badge>Not available yet</Badge>
            </div>
            <p className="mt-2 text-sm text-neutral-700">{item.description}</p>
            <p className="mt-3 text-sm text-neutral-500">{item.deferred}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
