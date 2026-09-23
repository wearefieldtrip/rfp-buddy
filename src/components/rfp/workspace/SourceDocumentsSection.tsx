import { File06 } from '@untitledui/icons'
import { EmptyState } from '@/components/shared/EmptyState'
import { MissingValue } from '@/components/shared/MissingValue'
import { Notice } from '@/components/shared/Notice'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/ui/Table'
import type { SourceDocument } from '@/features/rfps'
import { NOT_FOUND_LABEL } from '@/lib/constants/rfp'
import { SOURCE_DOCUMENT_TYPE_LABEL } from '@/lib/constants/rfpWorkspace'
import { formatCalendarDate } from '@/lib/utils/formatDate'
import { Card, PanelHeading } from './WorkspaceLayout'

export function SourceDocumentsSection({ documents }: { documents: readonly SourceDocument[] }) {
  return (
    <div className="space-y-4">
      <PanelHeading
        title="Source documents"
        description="The files this RFP's facts and requirements are drawn from."
      />
      <Notice title="Google Drive connection is deferred">
        Documents are listed for reference only. RFP Buddy doesn't open, store, or change files yet.
        Live file handling will arrive with the Google Drive integration.
      </Notice>

      {documents.length === 0 ? (
        <Card>
          <EmptyState
            icon={<File06 className="size-6" />}
            title="No source documents listed"
            description="Source documents for this RFP haven't been catalogued yet."
          />
        </Card>
      ) : (
        <Table label="Source documents" className="min-w-[44rem]">
          <TableHead>
            <tr>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Source reference</TableHeaderCell>
            </tr>
          </TableHead>
          <TableBody>
            {documents.map((document) => (
              <TableRow key={document.id}>
                <TableCell className="min-w-56 font-medium text-neutral-900">
                  {document.name}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {SOURCE_DOCUMENT_TYPE_LABEL[document.type]}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {document.date ? (
                    <time dateTime={document.date}>{formatCalendarDate(document.date)}</time>
                  ) : (
                    <MissingValue label={NOT_FOUND_LABEL} />
                  )}
                </TableCell>
                <TableCell className="min-w-48">{document.sourceReference}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
