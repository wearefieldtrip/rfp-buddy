import type { Rfp, RfpCreateInput, RfpFields, RfpUpdateInput, RfpWorkspace } from '../types'
import { isAllowedStatusDecision, normalizeOutcome } from '../workflowRules'
import {
  clearLocalData,
  readLocalData,
  writeLocalData,
  type LocalRfpData,
  type LocalRfpOverride,
  type LocalStoreStatus,
  type StorageLike,
} from './localRfpStore'

export type RepositoryError =
  'storage_unavailable' | 'write_failed' | 'not_found' | 'invalid_status_decision'

export type RepositoryResult<T> = { ok: true; value: T } | { ok: false; error: RepositoryError }

export function describeRepositoryError(error: RepositoryError): string {
  switch (error) {
    case 'storage_unavailable':
      return 'This browser isn’t allowing local storage, so nothing could be saved. Nothing was changed.'
    case 'write_failed':
      return 'The browser refused to save the data (it may be full or in a private mode). Nothing was changed.'
    case 'not_found':
      return 'That RFP no longer exists in this browser. Nothing was changed.'
    case 'invalid_status_decision':
      return 'That lifecycle status isn’t allowed with this pursuit decision. Nothing was changed.'
  }
}

export interface LocalDataSummary {
  createdCount: number
  editedFixtureCount: number
}

export interface RfpRepositorySnapshot {
  rfps: readonly Rfp[]
  storageStatus: LocalStoreStatus
  localSummary: LocalDataSummary
}

export interface RfpRepository {
  list(): readonly Rfp[]
  getById(id: string): Rfp | undefined
  getWorkspace(id: string): RfpWorkspace | undefined
  create(input: RfpCreateInput): RepositoryResult<Rfp>
  update(id: string, input: RfpUpdateInput): RepositoryResult<Rfp>
  /** Deletes a local RFP, or drops a fixture's local override so it reverts to built-in data. */
  removeLocal(id: string): RepositoryResult<void>
  /** Removes every local record and override. Built-in fixtures are untouched. */
  resetLocalData(): RepositoryResult<void>
  getSnapshot(): RfpRepositorySnapshot
  subscribe(listener: () => void): () => void
}

interface RepositoryOptions {
  fixtures: readonly RfpFields[]
  workspaces: readonly RfpWorkspace[]
  storage: StorageLike | null
  now?: () => Date
  createId?: () => string
}

function editableFields(fields: RfpUpdateInput): Omit<LocalRfpOverride, 'outcome' | 'updatedAt'> {
  return {
    client: fields.client,
    opportunity: fields.opportunity,
    sector: fields.sector,
    status: fields.status,
    proposalDeadline: fields.proposalDeadline,
    questionDeadline: fields.questionDeadline,
    budget: { ...fields.budget },
    owner: fields.owner,
    serviceAreas: [...fields.serviceAreas],
    scopeSummary: fields.scopeSummary,
  }
}

export function createRfpRepository({
  fixtures,
  workspaces,
  storage,
  now = () => new Date(),
  createId = () => `local-${crypto.randomUUID()}`,
}: RepositoryOptions): RfpRepository {
  // Fixtures are copied once so nothing downstream can mutate the source data.
  const fixtureById = new Map(fixtures.map((f) => [f.id, structuredClone(f)]))
  const workspaceById = new Map(workspaces.map((w) => [w.rfpId, w]))
  const listeners = new Set<() => void>()

  const initial = readLocalData(storage)
  let data: LocalRfpData = initial.data
  let storageStatus: LocalStoreStatus = initial.status
  let snapshot = buildSnapshot()

  function buildSnapshot(): RfpRepositorySnapshot {
    const merged: Rfp[] = []
    let editedFixtureCount = 0
    for (const fixture of fixtureById.values()) {
      const override = data.overrides[fixture.id]
      if (override) editedFixtureCount += 1
      merged.push({
        ...structuredClone(fixture),
        ...(override ? structuredClone(override) : {}),
        id: fixture.id,
        decision: fixture.decision,
        dataOrigin: 'fixture',
        isLocallyEdited: Boolean(override),
      })
    }
    for (const record of data.created) {
      merged.push({ ...structuredClone(record), dataOrigin: 'local', isLocallyEdited: false })
    }
    return {
      rfps: merged,
      storageStatus,
      localSummary: { createdCount: data.created.length, editedFixtureCount },
    }
  }

  function commit(next: LocalRfpData): RepositoryResult<void> {
    if (!storage) return { ok: false, error: 'storage_unavailable' }
    if (!writeLocalData(storage, next)) return { ok: false, error: 'write_failed' }
    data = next
    storageStatus = 'ok'
    publish()
    return { ok: true, value: undefined }
  }

  function publish() {
    snapshot = buildSnapshot()
    for (const listener of listeners) listener()
  }

  function getById(id: string) {
    return snapshot.rfps.find((rfp) => rfp.id === id)
  }

  return {
    list: () => snapshot.rfps,
    getById,
    getWorkspace: (id) => workspaceById.get(id),
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },

    create(input) {
      if (!isAllowedStatusDecision(input.status, input.decision)) {
        return { ok: false, error: 'invalid_status_decision' }
      }
      const record = {
        ...editableFields(input),
        id: createId(),
        decision: input.decision,
        outcome: normalizeOutcome(input.status, 'not_applicable'),
        updatedAt: now().toISOString(),
      }
      const result = commit({ ...data, created: [...data.created, record] })
      if (!result.ok) return result
      const created = getById(record.id)
      return created ? { ok: true, value: created } : { ok: false, error: 'not_found' }
    },

    update(id, input) {
      const current = getById(id)
      if (!current) return { ok: false, error: 'not_found' }
      if (!isAllowedStatusDecision(input.status, current.decision)) {
        return { ok: false, error: 'invalid_status_decision' }
      }
      const fields = {
        ...editableFields({ ...current, ...input }),
        outcome: normalizeOutcome(input.status, current.outcome),
        updatedAt: now().toISOString(),
      }
      const next: LocalRfpData =
        current.dataOrigin === 'local'
          ? {
              ...data,
              created: data.created.map((record) =>
                record.id === id ? { ...record, ...fields } : record,
              ),
            }
          : { ...data, overrides: { ...data.overrides, [id]: fields } }
      const result = commit(next)
      if (!result.ok) return result
      const updated = getById(id)
      return updated ? { ok: true, value: updated } : { ok: false, error: 'not_found' }
    },

    removeLocal(id) {
      if (data.created.some((record) => record.id === id)) {
        return commit({ ...data, created: data.created.filter((record) => record.id !== id) })
      }
      if (id in data.overrides) {
        const overrides = { ...data.overrides }
        delete overrides[id]
        return commit({ ...data, overrides })
      }
      return { ok: false, error: 'not_found' }
    },

    resetLocalData() {
      if (!storage) return { ok: false, error: 'storage_unavailable' }
      if (!clearLocalData(storage)) return { ok: false, error: 'write_failed' }
      data = { ...data, created: [], overrides: {} }
      storageStatus = 'ok'
      publish()
      return { ok: true, value: undefined }
    },
  }
}
