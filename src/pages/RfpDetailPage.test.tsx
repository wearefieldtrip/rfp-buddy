import { screen, within } from '@testing-library/react'
import { useLocation, useNavigate } from 'react-router'
import { describe, expect, it } from 'vitest'
import { AppRoutes } from '@/app/router'
import { formatCitation, getRfpWorkspaceFixture } from '@/features/rfps'
import { renderWithRouter } from '@/test/render'

function LocationProbe() {
  const location = useLocation()
  const navigate = useNavigate()
  return (
    <>
      <output aria-label="Current path">{location.pathname}</output>
      <button type="button" onClick={() => navigate(-1)}>
        Browser back
      </button>
    </>
  )
}

function renderWorkspace(route: string, history?: string[]) {
  return renderWithRouter(
    <>
      <AppRoutes />
      <LocationProbe />
    </>,
    { route, history },
  )
}

const currentPath = () => screen.getByRole('status', { name: 'Current path' })

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
    const requirements = getRfpWorkspaceFixture('rfp-004')?.requirements ?? []
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
