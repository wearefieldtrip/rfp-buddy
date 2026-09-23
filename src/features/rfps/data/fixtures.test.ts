import { describe, expect, it } from 'vitest'
import type { RfpDecision, RfpOutcome, RfpStatus } from '@/lib/constants/rfp'
import { FIT_DIMENSIONS } from '@/lib/constants/rfpWorkspace'
import { rfpFixtures } from './rfpFixtures'
import { rfpWorkspaceFixtures } from './rfpWorkspaceFixtures'

// Which decisions and outcomes each lifecycle status allows. Keeps the pipeline
// and the workspace from telling contradictory stories.
const ALLOWED: Record<RfpStatus, { decisions: RfpDecision[]; outcomes: RfpOutcome[] }> = {
  received: { decisions: ['not_decided'], outcomes: ['not_applicable'] },
  evaluating: {
    decisions: ['not_decided', 'needs_internal_input', 'go', 'conditional_go'],
    outcomes: ['not_applicable'],
  },
  pursuing: { decisions: ['go', 'conditional_go'], outcomes: ['not_applicable'] },
  submitted: { decisions: ['go', 'conditional_go'], outcomes: ['unknown'] },
  closed: { decisions: ['go', 'conditional_go'], outcomes: ['won', 'lost', 'unknown'] },
  declined: { decisions: ['no_go'], outcomes: ['declined'] },
  withdrawn: { decisions: ['go', 'conditional_go', 'no_go'], outcomes: ['withdrawn'] },
}

describe('RFP fixtures', () => {
  it.each(rfpFixtures)('$id has a consistent status, decision, and outcome', (rfp) => {
    expect(ALLOWED[rfp.status].decisions).toContain(rfp.decision)
    expect(ALLOWED[rfp.status].outcomes).toContain(rfp.outcome)
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
