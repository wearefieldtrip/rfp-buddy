import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  createRfpRepository,
  formatCitation,
  rfpFixtures,
  rfpWorkspaceFixtures,
  type RfpRepository,
} from '@/features/rfps'
import { chooseOption, currentPath, renderApp } from '@/test/appHarness'
import { createMemoryStorage } from '@/test/storage'

const renderWorkspace = (route: string, history?: string[], repository?: RfpRepository) =>
  renderApp(route, { history, repository })

describe('RfpDetailPage workspace', () => {
  it('renders the RFP title and organization for a valid ID', () => {
    renderWorkspace('/rfps/rfp-001')
    expect(
      screen.getByRole('heading', { level: 1, name: 'Youth Vaping Prevention Campaign' }),
    ).toBeInTheDocument()
    const overview = screen.getByRole('tabpanel', { name: 'Overview' })
    expect(
      within(overview).getAllByText('Harbor County Public Health Department').length,
    ).toBeGreaterThan(0)
  })

  it('shows a clear not-found state for an unknown RFP ID', () => {
    renderWorkspace('/rfps/rfp-999/requirements')
    expect(screen.getByRole('heading', { level: 1, name: 'RFP not found' })).toBeInTheDocument()
    expect(screen.getByText("We couldn't find that RFP")).toBeInTheDocument()
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
  })

  it('renders a source citation for every requirement', () => {
    renderWorkspace('/rfps/rfp-004/requirements')
    const table = screen.getByRole('table', { name: 'Requirements matrix' })
    const requirements = rfpWorkspaceFixtures.find((w) => w.rfpId === 'rfp-004')?.requirements ?? []
    expect(requirements.length).toBeGreaterThan(0)

    for (const requirement of requirements) {
      const row = within(table).getByText(requirement.requirement).closest('tr')
      expect(row).not.toBeNull()
      expect(
        within(row as HTMLElement).getByText(formatCitation(requirement.citation)),
      ).toBeInTheDocument()
    }
    expect(within(table).getAllByText(/^Addendum 1, /).length).toBeGreaterThan(0)
  })

  it('renders fit-review dimensions in the required order', () => {
    renderWorkspace('/rfps/rfp-001/fit-review')
    const panel = screen.getByRole('tabpanel', { name: 'Fit review' })
    const headings = within(panel)
      .getAllByRole('heading', { level: 3 })
      .map((heading) => heading.textContent)
    expect(headings).toEqual([
      'Mission Alignment',
      'Budget & Value Health',
      'Scope & Boundaries',
      'Timeline & Capacity',
    ])
    expect(within(panel).getByText(/not an AI assessment/)).toBeInTheDocument()
  })

  it('shows future-workflow placeholders that state integrations are deferred', () => {
    renderWorkspace('/rfps/rfp-001/upcoming')
    const panel = screen.getByRole('tabpanel', { name: 'Upcoming' })
    for (const name of ['Questions', 'Proposal', 'Compliance']) {
      const card = within(panel).getByRole('region', { name })
      expect(within(card).getByText(/deferred/i)).toBeInTheDocument()
      expect(within(card).queryByRole('button')).not.toBeInTheDocument()
      expect(within(card).queryByRole('link')).not.toBeInTheDocument()
    }
  })

  it('shows Conditional Go conditions on the decision tab', () => {
    renderWorkspace('/rfps/rfp-004/decision')
    const panel = screen.getByRole('tabpanel', { name: 'Decision' })
    expect(within(panel).getByText('Conditional Go')).toBeInTheDocument()
    expect(within(panel).getByText('Conditions to pursue')).toBeInTheDocument()
    expect(within(panel).getByText(/certified minority- or women-owned/)).toBeInTheDocument()
  })

  it('uses honest empty states for RFPs without workspace fixtures', () => {
    renderWorkspace('/rfps/rfp-003/requirements')
    expect(screen.getByRole('heading', { name: 'No requirements recorded' })).toBeInTheDocument()
  })

  it('updates the URL on tab change without adding history, so Back returns to the pipeline', async () => {
    const { user } = renderWorkspace('/rfps/rfp-001', ['/rfps', '/rfps/rfp-001'])

    await user.click(screen.getByRole('tab', { name: 'Requirements' }))
    expect(currentPath()).toHaveTextContent('/rfps/rfp-001/requirements')
    expect(screen.getByRole('tab', { name: 'Requirements' })).toHaveAttribute(
      'aria-selected',
      'true',
    )

    await user.click(screen.getByRole('tab', { name: 'Activity' }))
    expect(currentPath()).toHaveTextContent('/rfps/rfp-001/activity')

    await user.click(screen.getByRole('button', { name: 'Browser back' }))
    expect(currentPath()).toHaveTextContent(/^\/rfps$/)
    expect(screen.getByRole('heading', { level: 1, name: 'RFP Pipeline' })).toBeInTheDocument()
  })

  it('redirects an unknown workspace section to the overview', () => {
    renderWorkspace('/rfps/rfp-001/not-a-section')
    expect(currentPath()).toHaveTextContent(/^\/rfps\/rfp-001$/)
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true')
  })
})

describe('RfpDetailPage overview editing', () => {
  const ownerField = () => screen.getByRole('textbox', { name: 'Internal owner' })

  it('saves a fixture edit as a local override without changing the source fixture', async () => {
    const original = structuredClone(rfpFixtures.find((rfp) => rfp.id === 'rfp-001'))
    const { user } = renderWorkspace('/rfps/rfp-001', ['/rfps', '/rfps/rfp-001'])
    expect(screen.getByText('Built-in sample')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Edit overview' }))
    expect(screen.getByText(/Managed on the Decision tab/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Pursuit decision/ })).not.toBeInTheDocument()
    await user.clear(ownerField())
    await user.type(ownerField(), 'Sam Whitfield')
    await user.click(screen.getByRole('button', { name: 'Save RFP locally' }))

    expect(await screen.findByText('Overview saved in this browser.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Edit overview' })).toHaveFocus()
    const overview = screen.getByRole('tabpanel', { name: 'Overview' })
    expect(within(overview).getByText('Sam Whitfield')).toBeInTheDocument()
    expect(screen.getByText('Edited in this browser')).toBeInTheDocument()
    expect(
      screen.getByText(
        'This RFP is stored locally in this browser and is not shared with your team.',
      ),
    ).toBeInTheDocument()

    expect(rfpFixtures.find((rfp) => rfp.id === 'rfp-001')).toEqual(original)

    await user.click(screen.getByRole('button', { name: 'Browser back' }))
    const row = screen.getByRole('link', { name: 'Youth Vaping Prevention Campaign' }).closest('tr')
    expect(within(row as HTMLElement).getByText('Sam Whitfield')).toBeInTheDocument()
    expect(within(row as HTMLElement).getByText('Edited in this browser')).toBeInTheDocument()
  })

  it('updates a local RFP in both the overview and the pipeline row', async () => {
    const storage = createMemoryStorage()
    const repository = createRfpRepository({
      fixtures: rfpFixtures,
      workspaces: rfpWorkspaceFixtures,
      storage,
      createId: () => 'local-test',
    })
    repository.create({
      client: 'Eastside Library Foundation',
      opportunity: 'Summer Reading Outreach',
      sector: null,
      status: 'received',
      decision: 'not_decided',
      proposalDeadline: null,
      questionDeadline: null,
      budget: { minUsd: null, maxUsd: null, note: null },
      owner: null,
      serviceAreas: [],
      scopeSummary: null,
    })

    const { user } = renderWorkspace('/rfps/local-test', ['/rfps', '/rfps/local-test'], repository)
    await user.click(screen.getByRole('button', { name: 'Edit overview' }))
    await user.type(ownerField(), 'Jordan Reyes')
    await chooseOption(user, /Lifecycle status/, 'Evaluating')
    await user.click(screen.getByRole('button', { name: 'Save RFP locally' }))

    await screen.findByText('Overview saved in this browser.')
    const overview = screen.getByRole('tabpanel', { name: 'Overview' })
    expect(within(overview).getByText('Jordan Reyes')).toBeInTheDocument()
    expect(within(overview).getByText('Evaluating')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Browser back' }))
    const row = screen.getByRole('link', { name: 'Summer Reading Outreach' }).closest('tr')
    expect(within(row as HTMLElement).getByText('Jordan Reyes')).toBeInTheDocument()
    expect(within(row as HTMLElement).getByText('Evaluating')).toBeInTheDocument()
    expect(within(row as HTMLElement).getByText('Stored in this browser')).toBeInTheDocument()
  })

  it('rejects a status the current decision does not allow, and saves nothing', async () => {
    const { user } = renderWorkspace('/rfps/rfp-004')
    await user.click(screen.getByRole('button', { name: 'Edit overview' }))
    expect(
      screen.getByText(
        'Conditional Go allows: Evaluating, Pursuing, Submitted, Closed, Withdrawn.',
      ),
    ).toBeInTheDocument()
    await chooseOption(user, /Lifecycle status/, 'Declined')
    await user.click(screen.getByRole('button', { name: 'Save RFP locally' }))

    expect(
      within(await screen.findByRole('alert')).getByText(
        /Declined can't be used with the decision Conditional Go/,
      ),
    ).toBeInTheDocument()
    expect(window.localStorage.getItem('rfp-buddy.local-rfps.v1')).toBeNull()
  })

  it('keeps other workspace tabs read-only', () => {
    renderWorkspace('/rfps/rfp-004/decision')
    const panel = screen.getByRole('tabpanel', { name: 'Decision' })
    expect(within(panel).queryByRole('button')).not.toBeInTheDocument()
    expect(within(panel).queryByRole('textbox')).not.toBeInTheDocument()
  })
})
