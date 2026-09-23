import { describe, expect, it } from 'vitest'
import { rfpFixtures } from './data/rfpFixtures'
import { DEFAULT_RFP_FILTERS, filterRfps, hasActiveFilters } from './filterRfps'

describe('filterRfps', () => {
  it('returns every RFP with default filters', () => {
    expect(filterRfps(rfpFixtures, DEFAULT_RFP_FILTERS)).toHaveLength(rfpFixtures.length)
  })

  it('matches the search query against client, opportunity, and owner, case-insensitively', () => {
    const byClient = filterRfps(rfpFixtures, { ...DEFAULT_RFP_FILTERS, query: 'harbor county' })
    expect(byClient.map((rfp) => rfp.id)).toEqual(['rfp-001'])

    const byOpportunity = filterRfps(rfpFixtures, { ...DEFAULT_RFP_FILTERS, query: '988' })
    expect(byOpportunity.map((rfp) => rfp.id)).toEqual(['rfp-010'])

    const byOwner = filterRfps(rfpFixtures, { ...DEFAULT_RFP_FILTERS, query: '  PRIYA ' })
    expect(byOwner.map((rfp) => rfp.id).sort()).toEqual(['rfp-004', 'rfp-010'])
  })

  it('combines status and decision filters', () => {
    const result = filterRfps(rfpFixtures, {
      ...DEFAULT_RFP_FILTERS,
      status: 'closed',
      decision: 'won',
    })
    expect(result.map((rfp) => rfp.id)).toEqual(['rfp-007'])
  })

  it('returns an empty list when nothing matches', () => {
    expect(filterRfps(rfpFixtures, { ...DEFAULT_RFP_FILTERS, query: 'zzz-no-match' })).toEqual([])
  })
})

describe('hasActiveFilters', () => {
  it('ignores whitespace-only queries', () => {
    expect(hasActiveFilters({ ...DEFAULT_RFP_FILTERS, query: '   ' })).toBe(false)
    expect(hasActiveFilters({ ...DEFAULT_RFP_FILTERS, status: 'drafting' })).toBe(true)
  })
})
