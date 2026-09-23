import { ClipboardCheck } from '@untitledui/icons'
import { EmptyState } from '@/components/shared/EmptyState'
import { MissingValue } from '@/components/shared/MissingValue'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Badge } from '@/components/ui/Badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/ui/Table'
import { formatCitation, type RfpRequirement } from '@/features/rfps'
import { UNASSIGNED_LABEL } from '@/lib/constants/rfp'
import {
  REQUIREMENT_STATUS_LABEL,
  REQUIREMENT_STATUS_TONE,
  REQUIREMENT_STATUSES,
  REQUIREMENT_TYPE_LABEL,
} from '@/lib/constants/rfpWorkspace'
import { Card, PanelHeading } from './WorkspaceLayout'

function summarize(requirements: readonly RfpRequirement[]) {
  const counts = REQUIREMENT_STATUSES.map((status) => ({
    status,
    count: requirements.filter((requirement) => requirement.status === status).length,
  })).filter(({ count }) => count > 0)

  return counts
    .map(({ status, count }) => `${count} ${REQUIREMENT_STATUS_LABEL[status].toLowerCase()}`)
    .join(' · ')
}

export function RequirementsSection({ requirements }: { requirements: readonly RfpRequirement[] }) {
  return (
    <div className="space-y-4">
      <PanelHeading
        title="Requirements"
        description="Every requirement cites the document and location it comes from."
      />

      {requirements.length === 0 ? (
        <Card>
          <EmptyState
            icon={<ClipboardCheck className="size-6" />}
            title="No requirements recorded"
            description="Requirements for this RFP haven't been extracted and reviewed yet."
          />
        </Card>
      ) : (
        <>
          <p className="text-sm text-neutral-600">
            {requirements.length} requirements: {summarize(requirements)}
          </p>
          <Table label="Requirements matrix" className="min-w-[52rem]">
            <TableHead>
              <tr>
                <TableHeaderCell>Requirement</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Source</TableHeaderCell>
                <TableHeaderCell>Owner</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Notes</TableHeaderCell>
              </tr>
            </TableHead>
            <TableBody>
              {requirements.map((requirement) => (
                <TableRow key={requirement.id}>
                  <TableCell className="min-w-52 text-neutral-900">
                    {requirement.requirement}
                  </TableCell>
                  <TableCell>
                    <Badge>{REQUIREMENT_TYPE_LABEL[requirement.type]}</Badge>
                  </TableCell>
                  <TableCell className="min-w-36">
                    <cite className="not-italic">{formatCitation(requirement.citation)}</cite>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {requirement.owner ?? <MissingValue label={UNASSIGNED_LABEL} />}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      tone={REQUIREMENT_STATUS_TONE[requirement.status]}
                      label={REQUIREMENT_STATUS_LABEL[requirement.status]}
                    />
                  </TableCell>
                  <TableCell className="min-w-44 text-neutral-600">
                    {requirement.notes ?? <MissingValue label="None" />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  )
}
