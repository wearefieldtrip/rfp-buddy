import { describe, expect, it } from 'vitest'
import { FIT_DIMENSIONS } from '@/lib/constants/rfpWorkspace'
import { isAllowedStatusDecision, normalizeOutcome } from '../workflowRules'
import { rfpFixtures } from './rfpFixtures'
import { rfpWorkspaceFixtures } from './rfpWorkspaceFixtures'

describe('RFP fixtures', () => {
  // Uses the same canonical rules as the repository and the forms.
  it.each(rfpFixtures)('$id has a consistent status, decision, and outcome', (rfp) => {
    expect(isAllowedStatusDecision(rfp.status, rfp.decision)).toBe(true)
    expect(normalizeOutcome(rfp.status, rfp.outcome)).toBe(rfp.outcome)
  })

  it.each(rfpFixtures)('$id has a well-formed budget', ({ budget }) => {
    for (const amount of [budget.minUsd, budget.maxUsd]) {
      if (amount !== null) expect(Number.isSafeInteger(amount) && amount >= 0).toBe(true)
    }
    if (budget.minUsd !== null && budget.maxUsd !== null) {
      expect(budget.maxUsd).toBeGreaterThanOrEqual(budget.minUsd)
    }
  })

  it('has unique IDs', () => {
    expect(new Set(rfpFixtures.map((rfp) => rfp.id)).size).toBe(rfpFixtures.length)
  })
})

describe('RFP workspace fixtures', () => {
  it('covers exactly rfp-001, rfp-002, and rfp-004', () => {
    expect(rfpWorkspaceFixtures.map((workspace) => workspace.rfpId)).toEqual([
      'rfp-001',
      'rfp-002',
      'rfp-004',
    ])
  })

  it.each(rfpWorkspaceFixtures)('$rfpId agrees with its pipeline record', (workspace) => {
    const rfp = rfpFixtures.find((candidate) => candidate.id === workspace.rfpId)
    expect(rfp).toBeDefined()
    if (!rfp) return

    expect(workspace.decisionRecord === null).toBe(rfp.decision === 'not_decided')
    if (rfp.decision === 'conditional_go') {
      expect(workspace.decisionRecord?.conditions.length).toBeGreaterThan(0)
    }
    if (rfp.decision === 'needs_internal_input') {
      expect(workspace.decisionRecord?.inputNeeded.length).toBeGreaterThan(0)
    }
  })

  it.each(rfpWorkspaceFixtures)('$rfpId cites a source for every requirement', (workspace) => {
    for (const requirement of workspace.requirements) {
      expect(requirement.citation.document.trim()).not.toBe('')
      expect(requirement.citation.location.trim()).not.toBe('')
    }
  })

  it.each(rfpWorkspaceFixtures)('$rfpId assesses every fit dimension', (workspace) => {
    expect(Object.keys(workspace.fitReview?.dimensions ?? {}).sort()).toEqual(
      [...FIT_DIMENSIONS].sort(),
    )
  })

  it('attributes activity to people, not AI or integrations', () => {
    for (const workspace of rfpWorkspaceFixtures) {
      for (const event of workspace.activity) {
        expect(event.actor).not.toMatch(/\b(ai|bot|system|integration|perplexity|drive)\b/i)
        expect(event.description).not.toMatch(/\b(ai|automatically|synced|auto-)\b/i)
      }
    }
  })

  it('includes an addendum citation for rfp-004', () => {
    const workspace = rfpWorkspaceFixtures.find((candidate) => candidate.rfpId === 'rfp-004')
    expect(workspace?.requirements.some((r) => r.citation.document === 'Addendum 1')).toBe(true)
  })
})
