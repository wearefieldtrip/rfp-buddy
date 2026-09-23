import type { RfpOriginKind } from '@/lib/constants/rfp'
import type { Rfp } from './types'

export function getRfpOriginKind(rfp: Pick<Rfp, 'dataOrigin' | 'isLocallyEdited'>): RfpOriginKind {
  if (rfp.dataOrigin === 'local') return 'local'
  return rfp.isLocallyEdited ? 'fixture_edited' : 'fixture'
}

/** True when any part of the record lives only in this browser. */
export function isBrowserLocal(rfp: Pick<Rfp, 'dataOrigin' | 'isLocallyEdited'>): boolean {
  return getRfpOriginKind(rfp) !== 'fixture'
}
