import type { RfpDecision, RfpSector, RfpStatus } from '@/lib/constants/rfp'
import type { IsoDateString } from '@/types/common'

export interface Rfp {
  id: string
  client: string
  opportunity: string
  sector: RfpSector
  status: RfpStatus
  decision: RfpDecision
  /** `null` when the RFP does not state a deadline; render as "Not found". */
  proposalDeadline: IsoDateString | null
  /** Budget as stated in the RFP. `null` when not stated; render as "Not found". */
  budget: string | null
  /** `null` when no one has been assigned. */
  owner: string | null
  updatedAt: IsoDateString
}
