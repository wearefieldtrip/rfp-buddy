import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LOCAL_RFPS_STORAGE_KEY } from '@/lib/constants/storage'
import { createMemoryStorage, createReadOnlyStorage, createThrowingStorage } from '@/test/storage'
import { rfpFixtures } from '../data/rfpFixtures'
import { rfpWorkspaceFixtures } from '../data/rfpWorkspaceFixtures'
import type { RfpCreateInput, RfpUpdateInput } from '../types'
import { createRfpRepository } from './rfpRepository'
import type { StorageLike } from './localRfpStore'

const FIXTURES_SNAPSHOT = structuredClone(rfpFixtures)

const newInput: RfpCreateInput = {
  client: 'Eastside Library Foundation',
  opportunity: 'Summer Reading Outreach',
  sector: 'foundation',
  status: 'received',
  decision: 'not_decided',
  proposalDeadline: '2026-12-01',
  questionDeadline: null,
  budget: { minUsd: 20_000, maxUsd: 30_000, note: null },
  owner: null,
  serviceAreas: ['community_engagement'],
  scopeSummary: null,
}

function repo(storage: StorageLike | null, ids: string[] = ['local-a', 'local-b', 'local-c']) {
  const queue = [...ids]
  return createRfpRepository({
    fixtures: rfpFixtures,
    workspaces: rfpWorkspaceFixtures,
    storage,
    now: () => new Date('2026-09-24T12:00:00Z'),
    createId: () => queue.shift() ?? 'local-overflow',
  })
}

function toUpdate(id: string, repository: ReturnType<typeof repo>): RfpUpdateInput {
  const rfp = repository.getById(id)
  if (!rfp) throw new Error(`missing ${id}`)
  const { client, opportunity, sector, status, proposalDeadline, questionDeadline } = rfp
  const { budget, owner, serviceAreas, scopeSummary } = rfp
  return {
    client,
    opportunity,
    sector,
    status,
    proposalDeadline,
    questionDeadline,
    budget,
    owner,
    serviceAreas,
    scopeSummary,
  }
}

let storage: ReturnType<typeof createMemoryStorage>

beforeEach(() => {
  storage = createMemoryStorage()
})

describe('createRfpRepository', () => {
  it('lists built-in fixtures marked as fixture data', () => {
    const repository = repo(storage)
    expect(repository.list()).toHaveLength(rfpFixtures.length)
    expect(repository.list().every((r) => r.dataOrigin === 'fixture' && !r.isLocallyEdited)).toBe(
      true,
    )
    expect(repository.getSnapshot().storageStatus).toBe('ok')
  })

  it('creates a local record with default outcome and persists it for the next load', () => {
    const repository = repo(storage)
    const result = repository.create(newInput)
    expect(result.ok).toBe(true)
    if (!result.ok) return

    expect(result.value).toMatchObject({
      id: 'local-a',
      dataOrigin: 'local',
      status: 'received',
      decision: 'not_decided',
      outcome: 'not_applicable',
      updatedAt: '2026-09-24T12:00:00.000Z',
    })
    expect(repository.list()).toHaveLength(rfpFixtures.length + 1)

    // Simulated browser reload: a brand-new repository over the same storage.
    const reloaded = repo(storage)
    expect(reloaded.getById('local-a')).toMatchObject({
      client: 'Eastside Library Foundation',
      dataOrigin: 'local',
    })
  })

  it('rejects an incompatible status and decision', () => {
    const repository = repo(storage)
    const result = repository.create({ ...newInput, status: 'received', decision: 'go' })
    expect(result).toEqual({ ok: false, error: 'invalid_status_decision' })
    expect(storage.dump()).toEqual({})
  })

  it('normalizes outcome from status on create', () => {
    const repository = repo(storage)
    const result = repository.create({ ...newInput, status: 'declined', decision: 'no_go' })
    expect(result.ok && result.value.outcome).toBe('declined')
  })

  it('stores a fixture edit as a local override and leaves the fixture untouched', () => {
    const repository = repo(storage)
    const result = repository.update('rfp-001', {
      ...toUpdate('rfp-001', repository),
      owner: 'Sam Whitfield',
    })
    expect(result.ok).toBe(true)

    const edited = repository.getById('rfp-001')
    expect(edited).toMatchObject({
      owner: 'Sam Whitfield',
      dataOrigin: 'fixture',
      isLocallyEdited: true,
      decision: 'go',
    })
    expect(rfpFixtures).toEqual(FIXTURES_SNAPSHOT)
    expect(
      Object.keys(JSON.parse(storage.dump()[LOCAL_RFPS_STORAGE_KEY] ?? '{}').overrides),
    ).toEqual(['rfp-001'])
  })

  it('keeps a recorded won outcome when a closed RFP stays closed, and normalizes otherwise', () => {
    const repository = repo(storage)
    repository.update('rfp-007', { ...toUpdate('rfp-007', repository), owner: 'Priya Natarajan' })
    expect(repository.getById('rfp-007')?.outcome).toBe('won')

    repository.update('rfp-007', { ...toUpdate('rfp-007', repository), status: 'submitted' })
    expect(repository.getById('rfp-007')?.outcome).toBe('unknown')
  })

  it('rejects a status that the current decision does not allow', () => {
    const repository = repo(storage)
    const result = repository.update('rfp-004', {
      ...toUpdate('rfp-004', repository),
      status: 'declined',
    })
    expect(result).toEqual({ ok: false, error: 'invalid_status_decision' })
    expect(repository.getById('rfp-004')?.isLocallyEdited).toBe(false)
  })

  it('updates a local record in place', () => {
    const repository = repo(storage)
    repository.create(newInput)
    repository.update('local-a', { ...toUpdate('local-a', repository), client: 'Renamed Org' })
    expect(repository.getById('local-a')?.client).toBe('Renamed Org')
    expect(repository.list().filter((r) => r.dataOrigin === 'local')).toHaveLength(1)
  })

  it('removeLocal deletes local records and reverts fixture overrides', () => {
    const repository = repo(storage)
    repository.create(newInput)
    repository.update('rfp-002', { ...toUpdate('rfp-002', repository), owner: 'Maya Okafor' })

    expect(repository.removeLocal('local-a')).toEqual({ ok: true, value: undefined })
    expect(repository.getById('local-a')).toBeUndefined()

    expect(repository.removeLocal('rfp-002').ok).toBe(true)
    expect(repository.getById('rfp-002')).toMatchObject({
      owner: 'Jordan Reyes',
      isLocallyEdited: false,
    })

    expect(repository.removeLocal('rfp-003')).toEqual({ ok: false, error: 'not_found' })
  })

  it('resetLocalData removes local records and overrides and keeps every fixture', () => {
    const repository = repo(storage)
    repository.create(newInput)
    repository.update('rfp-001', { ...toUpdate('rfp-001', repository), client: 'Changed' })

    expect(repository.resetLocalData().ok).toBe(true)
    expect(storage.dump()).toEqual({})
    expect(repository.list()).toHaveLength(rfpFixtures.length)
    expect(repository.getById('rfp-001')?.client).toBe('Harbor County Public Health Department')
    expect(repository.getSnapshot().localSummary).toEqual({
      createdCount: 0,
      editedFixtureCount: 0,
    })
    expect(rfpFixtures).toEqual(FIXTURES_SNAPSHOT)
  })

  it('notifies subscribers when data changes', () => {
    const repository = repo(storage)
    const listener = vi.fn()
    const unsubscribe = repository.subscribe(listener)
    repository.create(newInput)
    expect(listener).toHaveBeenCalledTimes(1)
    unsubscribe()
    repository.resetLocalData()
    expect(listener).toHaveBeenCalledTimes(1)
  })
})

describe('createRfpRepository with unusable storage', () => {
  it.each([
    ['invalid JSON', '{not json'],
    ['the wrong version', JSON.stringify({ version: 99, created: [], overrides: {} })],
    [
      'records that fail validation',
      JSON.stringify({ version: 1, created: [{ id: 'local-x', client: 42 }], overrides: {} }),
    ],
  ])('treats %s as corrupted and still lists fixtures', (_label, raw) => {
    const corrupted = createMemoryStorage({ [LOCAL_RFPS_STORAGE_KEY]: raw })
    const repository = repo(corrupted)
    expect(repository.getSnapshot().storageStatus).toBe('corrupted')
    expect(repository.list()).toHaveLength(rfpFixtures.length)

    // The next successful save replaces the unreadable data.
    expect(repository.create(newInput).ok).toBe(true)
    expect(repository.getSnapshot().storageStatus).toBe('ok')
  })

  it.each([
    ['no storage at all', null],
    ['storage that throws on every call', createThrowingStorage()],
  ])('reports %s as unavailable and still lists fixtures', (_label, unusable) => {
    const repository = repo(unusable)
    expect(repository.getSnapshot().storageStatus).toBe('unavailable')
    expect(repository.list()).toHaveLength(rfpFixtures.length)
    expect(repository.create(newInput).ok).toBe(false)
  })

  it('reports a refused write without changing data', () => {
    const repository = repo(createReadOnlyStorage())
    expect(repository.create(newInput)).toEqual({ ok: false, error: 'write_failed' })
    expect(repository.list()).toHaveLength(rfpFixtures.length)
  })
})
