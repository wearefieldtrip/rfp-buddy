import { z } from 'zod'
import { RFP_DECISIONS, RFP_OUTCOMES, RFP_SECTORS, RFP_STATUSES } from '@/lib/constants/rfp'
import { SERVICE_AREAS } from '@/lib/constants/rfpWorkspace'
import { LOCAL_RFPS_STORAGE_KEY, LOCAL_RFPS_STORAGE_VERSION } from '@/lib/constants/storage'

// The only module that reads or writes browser storage for RFPs. Everything it
// reads is validated before use; anything unexpected is treated as corrupted.

export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

const wholeDollars = z.number().int().nonnegative().nullable()

const storedFieldsSchema = z.object({
  client: z.string(),
  opportunity: z.string(),
  sector: z.enum(RFP_SECTORS).nullable(),
  status: z.enum(RFP_STATUSES),
  outcome: z.enum(RFP_OUTCOMES),
  proposalDeadline: z.iso.date().nullable(),
  questionDeadline: z.iso.date().nullable(),
  budget: z.object({ minUsd: wholeDollars, maxUsd: wholeDollars, note: z.string().nullable() }),
  owner: z.string().nullable(),
  serviceAreas: z.array(z.enum(SERVICE_AREAS)),
  scopeSummary: z.string().nullable(),
  updatedAt: z.iso.datetime(),
})

const localRecordSchema = storedFieldsSchema.extend({
  id: z.string().startsWith('local-'),
  decision: z.enum(RFP_DECISIONS),
})

/** A local edit to a built-in fixture. Decision is never overridden. */
const overrideSchema = storedFieldsSchema

const localDataSchema = z.object({
  version: z.literal(LOCAL_RFPS_STORAGE_VERSION),
  created: z.array(localRecordSchema),
  overrides: z.record(z.string(), overrideSchema),
})

export type LocalRfpRecord = z.infer<typeof localRecordSchema>
export type LocalRfpOverride = z.infer<typeof overrideSchema>
export type LocalRfpData = z.infer<typeof localDataSchema>

export type LocalStoreStatus = 'ok' | 'unavailable' | 'corrupted'

export function emptyLocalData(): LocalRfpData {
  return { version: LOCAL_RFPS_STORAGE_VERSION, created: [], overrides: {} }
}

export function readLocalData(storage: StorageLike | null): {
  data: LocalRfpData
  status: LocalStoreStatus
} {
  if (!storage) return { data: emptyLocalData(), status: 'unavailable' }

  let raw: string | null
  try {
    raw = storage.getItem(LOCAL_RFPS_STORAGE_KEY)
  } catch {
    return { data: emptyLocalData(), status: 'unavailable' }
  }
  if (raw === null) return { data: emptyLocalData(), status: 'ok' }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return { data: emptyLocalData(), status: 'corrupted' }
  }

  const result = localDataSchema.safeParse(parsed)
  return result.success
    ? { data: result.data, status: 'ok' }
    : { data: emptyLocalData(), status: 'corrupted' }
}

/** Returns false if the browser refused the write (unavailable, quota, privacy mode). */
export function writeLocalData(storage: StorageLike | null, data: LocalRfpData): boolean {
  if (!storage) return false
  try {
    storage.setItem(LOCAL_RFPS_STORAGE_KEY, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}

export function clearLocalData(storage: StorageLike | null): boolean {
  if (!storage) return false
  try {
    storage.removeItem(LOCAL_RFPS_STORAGE_KEY)
    return true
  } catch {
    return false
  }
}

/** The browser's localStorage, or `null` if it can't be used at all. */
export function getBrowserStorage(): StorageLike | null {
  try {
    const storage = window.localStorage
    const probe = `${LOCAL_RFPS_STORAGE_KEY}.probe`
    storage.setItem(probe, probe)
    storage.removeItem(probe)
    return storage
  } catch {
    return null
  }
}
