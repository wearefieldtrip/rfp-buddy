import { Target04 } from '@untitledui/icons'
import { EmptyState } from '@/components/shared/EmptyState'
import { Notice } from '@/components/shared/Notice'
import { StatusBadge } from '@/components/shared/StatusBadge'
import type { FitDimensionAssessment, FitReview } from '@/features/rfps'
import {
  FIT_DIMENSION_LABEL,
  FIT_DIMENSIONS,
  FIT_RATING_LABEL,
  FIT_RATING_TONE,
} from '@/lib/constants/rfpWorkspace'
import { formatDate } from '@/lib/utils/formatDate'
import { Card, PanelHeading } from './WorkspaceLayout'

const LISTS: {
  key: keyof Pick<FitDimensionAssessment, 'evidence' | 'risks' | 'unknowns' | 'conditions'>
  label: string
}[] = [
  { key: 'evidence', label: 'Evidence' },
  { key: 'risks', label: 'Risks' },
  { key: 'unknowns', label: 'Unknowns' },
  { key: 'conditions', label: 'Recommended conditions' },
]

function DimensionCard({
  label,
  assessment,
}: {
  label: string
  assessment: FitDimensionAssessment
}) {
  return (
    <article
      aria-label={label}
      className="rounded-lg border border-neutral-200 bg-white p-5 shadow-xs"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-neutral-900">{label}</h3>
        <StatusBadge
          tone={FIT_RATING_TONE[assessment.rating]}
          label={FIT_RATING_LABEL[assessment.rating]}
        />
      </div>
      <p className="mt-2 text-sm text-neutral-700">{assessment.summary}</p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {LISTS.map(({ key, label: listLabel }) => {
          const items = assessment[key]
          return (
            <div key={key}>
              <h4 className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">
                {listLabel}
              </h4>
              {items.length > 0 ? (
                <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-neutral-700">
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1.5 text-sm text-neutral-500 italic">None identified</p>
              )}
            </div>
          )
        })}
      </div>
    </article>
  )
}

export function FitReviewSection({ fitReview }: { fitReview: FitReview | null }) {
  return (
    <div className="space-y-4">
      <PanelHeading title="Fit review" />
      <Notice tone="warning" title="Illustrative fixture data">
        This fit review is sample content written for the prototype. It is not an AI assessment and
        not a real evaluation of this opportunity.
      </Notice>

      {!fitReview ? (
        <Card>
          <EmptyState
            icon={<Target04 className="size-6" />}
            title="No fit review recorded"
            description="Nobody has reviewed this RFP against Fieldtrip's fit criteria yet."
          />
        </Card>
      ) : (
        <>
          <p className="text-sm text-neutral-600">
            Reviewed by {fitReview.reviewedBy} on{' '}
            <time dateTime={fitReview.reviewedAt}>{formatDate(fitReview.reviewedAt)}</time>
          </p>
          <div className="space-y-4">
            {FIT_DIMENSIONS.map((dimension) => (
              <DimensionCard
                key={dimension}
                label={FIT_DIMENSION_LABEL[dimension]}
                assessment={fitReview.dimensions[dimension]}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
