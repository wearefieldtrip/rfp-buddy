import { Edit05 } from '@untitledui/icons'
import { useEffect, useRef, useState } from 'react'
import { MissingValue } from '@/components/shared/MissingValue'
import { Notice } from '@/components/shared/Notice'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { rfpToFormValues, type Rfp, type RfpUpdateInput, type RfpWorkspace } from '@/features/rfps'
import { NEEDS_REVIEW_LABEL, NOT_FOUND_LABEL, RFP_SECTOR_LABEL } from '@/lib/constants/rfp'
import { SERVICE_AREA_LABEL } from '@/lib/constants/rfpWorkspace'
import { formatCalendarDate } from '@/lib/utils/formatDate'
import { RfpBudgetValue } from '../RfpBudgetValue'
import { RfpForm, type RfpFormSaveOutcome } from '../RfpForm'
import { RfpDecisionBadge, RfpOutcomeBadge, RfpStatusBadge } from '../RfpStatusBadge'
import { Card, FactList, PanelHeading } from './WorkspaceLayout'

interface OverviewSectionProps {
  rfp: Rfp
  workspace: RfpWorkspace | undefined
  onSave: (input: RfpUpdateInput) => RfpFormSaveOutcome
}

function CalendarDate({ value }: { value: string | null }) {
  return value ? (
    <time dateTime={value}>{formatCalendarDate(value)}</time>
  ) : (
    <MissingValue label={NOT_FOUND_LABEL} />
  )
}

function OverviewFacts({ rfp }: { rfp: Rfp }) {
  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Opportunity">
          <FactList
            facts={[
              { label: 'Organization', value: rfp.client },
              { label: 'Opportunity', value: rfp.opportunity },
              {
                label: 'Sector',
                value: rfp.sector ? (
                  RFP_SECTOR_LABEL[rfp.sector]
                ) : (
                  <MissingValue label={NEEDS_REVIEW_LABEL} />
                ),
              },
              {
                label: 'Internal owner',
                value: rfp.owner ?? <MissingValue label={NEEDS_REVIEW_LABEL} />,
              },
            ]}
          />
        </Card>

        <Card title="Status and dates">
          <FactList
            facts={[
              { label: 'Lifecycle status', value: <RfpStatusBadge status={rfp.status} /> },
              { label: 'Pursuit decision', value: <RfpDecisionBadge decision={rfp.decision} /> },
              { label: 'Outcome', value: <RfpOutcomeBadge outcome={rfp.outcome} /> },
              { label: 'Proposal deadline', value: <CalendarDate value={rfp.proposalDeadline} /> },
              { label: 'Question deadline', value: <CalendarDate value={rfp.questionDeadline} /> },
              { label: 'Budget', value: <RfpBudgetValue budget={rfp.budget} /> },
            ]}
          />
        </Card>
      </div>

      <Card title="Scope">
        <FactList
          facts={[
            {
              label: 'Service areas',
              value:
                rfp.serviceAreas.length > 0 ? (
                  <ul className="flex flex-wrap gap-1.5" aria-label="Service areas">
                    {rfp.serviceAreas.map((area) => (
                      <li key={area}>
                        <Badge>{SERVICE_AREA_LABEL[area]}</Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <MissingValue label={NEEDS_REVIEW_LABEL} />
                ),
            },
            {
              label: 'Scope summary',
              value: rfp.scopeSummary ?? <MissingValue label={NEEDS_REVIEW_LABEL} />,
            },
          ]}
        />
      </Card>
    </>
  )
}

export function OverviewSection({ rfp, workspace, onSave }: OverviewSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState('')
  const restoreFocusRef = useRef(false)
  const headerRef = useRef<HTMLDivElement>(null)

  // After leaving edit mode, return focus to the Edit button instead of losing it.
  useEffect(() => {
    if (!isEditing && restoreFocusRef.current) {
      restoreFocusRef.current = false
      headerRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
    }
  }, [isEditing])

  const exitEditMode = (nextMessage: string) => {
    restoreFocusRef.current = true
    setIsEditing(false)
    setMessage(nextMessage)
  }

  return (
    <div className="space-y-4">
      <div ref={headerRef} className="flex flex-wrap items-start justify-between gap-3">
        <PanelHeading title={isEditing ? 'Edit overview' : 'Overview'} />
        {!isEditing ? (
          <Button
            variant="secondary"
            size="sm"
            onPress={() => {
              setMessage('')
              setIsEditing(true)
            }}
          >
            <Edit05 className="size-4" aria-hidden="true" />
            Edit overview
          </Button>
        ) : null}
      </div>

      <p aria-live="polite" className="text-sm font-medium text-success-700 empty:hidden">
        {message}
      </p>

      {isEditing ? (
        <>
          {rfp.dataOrigin === 'fixture' ? (
            <Notice title="Edits are saved in this browser only">
              Saving stores your changes locally. The built-in sample record isn’t changed, and
              resetting local prototype data restores it.
            </Notice>
          ) : null}
          <RfpForm
            mode="edit"
            defaultValues={rfpToFormValues(rfp)}
            onSubmit={(input) => {
              const { decision: _decision, ...update } = input
              const outcome = onSave(update)
              if (outcome.ok) exitEditMode('Overview saved in this browser.')
              return outcome
            }}
            onCancel={() => exitEditMode('')}
          />
        </>
      ) : (
        <>
          {!workspace ? (
            <Notice title="Review details haven't been added yet">
              Sources, requirements, fit review, and activity will appear here once someone reviews
              this RFP.
            </Notice>
          ) : null}
          <OverviewFacts rfp={rfp} />
        </>
      )}
    </div>
  )
}
