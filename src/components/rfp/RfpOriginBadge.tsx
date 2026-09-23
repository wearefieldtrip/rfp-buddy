import { Badge } from '@/components/ui/Badge'
import { getRfpOriginKind, type Rfp } from '@/features/rfps'
import { RFP_ORIGIN_LABEL, RFP_ORIGIN_TONE } from '@/lib/constants/rfp'

export function RfpOriginBadge({ rfp }: { rfp: Pick<Rfp, 'dataOrigin' | 'isLocallyEdited'> }) {
  const kind = getRfpOriginKind(rfp)
  return <Badge tone={RFP_ORIGIN_TONE[kind]}>{RFP_ORIGIN_LABEL[kind]}</Badge>
}
