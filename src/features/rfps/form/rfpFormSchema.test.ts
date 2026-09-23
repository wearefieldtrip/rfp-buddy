import { describe, expect, it } from 'vitest'
import { createRfpFormSchema, EMPTY_RFP_FORM_VALUES, type RfpFormValues } from './rfpFormSchema'

const valid: RfpFormValues = {
  ...EMPTY_RFP_FORM_VALUES,
  client: 'Eastside Library Foundation',
  opportunity: 'Summer Reading Outreach',
}

function issues(values: Partial<RfpFormValues>, mode: 'create' | 'edit' = 'create') {
  const result = createRfpFormSchema(mode).safeParse({ ...valid, ...values })
  return result.success
    ? {}
    : Object.fromEntries(result.error.issues.map((issue) => [issue.path.join('.'), issue.message]))
}

describe('createRfpFormSchema', () => {
  it('turns blank optional fields into null and applies defaults', () => {
    const result = createRfpFormSchema('create').parse({ ...valid, budgetMin: '1,500' })
    expect(result).toEqual({
      client: 'Eastside Library Foundation',
      opportunity: 'Summer Reading Outreach',
      sector: null,
      status: 'received',
      decision: 'not_decided',
      proposalDeadline: null,
      questionDeadline: null,
      budget: { minUsd: 1500, maxUsd: null, note: null },
      owner: null,
      serviceAreas: [],
      scopeSummary: null,
    })
  })

  it('requires organization and opportunity, with one message each', () => {
    expect(issues({ client: '  ', opportunity: '' })).toEqual({
      client: 'Enter the organization / client.',
      opportunity: 'Enter the opportunity title.',
    })
  })

  it.each([
    ['client', 'A', 'at least 2'],
    ['client', 'x'.repeat(121), '120 characters or fewer'],
    ['opportunity', 'Ab', 'at least 3'],
    ['opportunity', 'x'.repeat(181), '180 characters or fewer'],
    ['owner', 'J', 'at least 2'],
    ['owner', 'x'.repeat(121), '120 characters or fewer'],
    ['scopeSummary', 'x'.repeat(1001), '1000 characters or fewer'],
    ['budgetNote', 'x'.repeat(241), '240 characters or fewer'],
  ] as const)('limits %s length', (field, value, message) => {
    expect(issues({ [field]: value })[field]).toContain(message)
  })

  it.each(['-5', '10.50', 'abc', '1e6'])('rejects %s as a budget amount', (value) => {
    expect(issues({ budgetMin: value }).budgetMin).toContain('whole-dollar amount')
  })

  it('rejects a budget maximum lower than the minimum', () => {
    expect(issues({ budgetMin: '50000', budgetMax: '40000' })).toEqual({
      budgetMax: 'Budget maximum can’t be lower than the budget minimum.',
    })
    expect(issues({ budgetMin: '40000', budgetMax: '40000' })).toEqual({})
  })

  it('rejects impossible dates', () => {
    expect(issues({ proposalDeadline: '2026-13-45' }).proposalDeadline).toContain('valid date')
  })

  it('flags an incompatible status and decision on the decision field when creating', () => {
    expect(issues({ status: 'received', decision: 'go' })).toEqual({
      decision: "Received can't be used with the decision Go.",
    })
  })

  it('flags an incompatible status and decision on the status field when editing', () => {
    expect(issues({ status: 'declined', decision: 'conditional_go' }, 'edit')).toEqual({
      status: "Declined can't be used with the decision Conditional Go.",
    })
  })
})
