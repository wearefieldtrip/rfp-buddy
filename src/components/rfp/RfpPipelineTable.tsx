import { Link } from 'react-aria-components'
import { MissingValue } from '@/components/shared/MissingValue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/ui/Table'
import type { Rfp } from '@/features/rfps'
import { NOT_FOUND_LABEL, RFP_SECTOR_LABEL, UNASSIGNED_LABEL } from '@/lib/constants/rfp'
import { formatCalendarDate, formatDate } from '@/lib/utils/formatDate'
import { paths } from '@/routes/paths'
import { RfpDecisionBadge, RfpLifecycleBadges } from './RfpStatusBadge'

export function RfpPipelineTable({ rfps }: { rfps: readonly Rfp[] }) {
  return (
    <Table label="RFP pipeline" className="min-w-[56rem]">
      <TableHead>
        <tr>
          <TableHeaderCell>Client</TableHeaderCell>
          <TableHeaderCell>Opportunity</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell>Decision</TableHeaderCell>
          <TableHeaderCell>Proposal deadline</TableHeaderCell>
          <TableHeaderCell>Budget</TableHeaderCell>
          <TableHeaderCell>Owner</TableHeaderCell>
          <TableHeaderCell>Updated</TableHeaderCell>
        </tr>
      </TableHead>
      <TableBody>
        {rfps.map((rfp) => (
          <TableRow key={rfp.id}>
            <TableCell className="min-w-32">
              <div className="font-medium text-neutral-900">{rfp.client}</div>
              <div className="text-xs text-neutral-500">{RFP_SECTOR_LABEL[rfp.sector]}</div>
            </TableCell>
            <TableCell className="min-w-32">
              <Link
                href={paths.rfpDetail(rfp.id)}
                className="rounded-sm font-medium text-neutral-900 underline-offset-4 outline-none data-focus-visible:ring-2 data-focus-visible:ring-accent-500 data-hovered:underline"
              >
                {rfp.opportunity}
              </Link>
            </TableCell>
            <TableCell>
              <RfpLifecycleBadges status={rfp.status} outcome={rfp.outcome} />
            </TableCell>
            <TableCell>
              <RfpDecisionBadge decision={rfp.decision} />
            </TableCell>
            <TableCell className="whitespace-nowrap">
              {rfp.proposalDeadline ? (
                <time dateTime={rfp.proposalDeadline}>
                  {formatCalendarDate(rfp.proposalDeadline)}
                </time>
              ) : (
                <MissingValue label={NOT_FOUND_LABEL} />
              )}
            </TableCell>
            <TableCell className="min-w-20">
              {rfp.budget ?? <MissingValue label={NOT_FOUND_LABEL} />}
            </TableCell>
            <TableCell>{rfp.owner ?? <MissingValue label={UNASSIGNED_LABEL} />}</TableCell>
            <TableCell className="whitespace-nowrap text-neutral-500">
              <time dateTime={rfp.updatedAt}>{formatDate(rfp.updatedAt)}</time>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
