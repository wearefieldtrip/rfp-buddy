import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  createRfpRepository,
  rfpFixtures,
  rfpWorkspaceFixtures,
  type RfpRepository,
} from '@/features/rfps'
import { LOCAL_RFPS_STORAGE_KEY, PROTOTYPE_STORAGE_NOTICE } from '@/lib/constants/storage'
import { renderWithRouter } from '@/test/render'
import { createThrowingStorage } from '@/test/storage'
import { RfpPipelinePage } from './RfpPipelinePage'

describe('RfpPipelinePage', () => {
  it('renders every fixture RFP with the expected columns', () => {
    renderWithRouter(<RfpPipelinePage />)

    const table = screen.getByRole('table', { name: 'RFP pipeline' })
    const headers = within(table)
      .getAllByRole('columnheader')
      .map((th) => th.textContent)
    expect(headers).toEqual([
      'Client',
      'Opportunity',
      'Status',
      'Decision',
      'Proposal deadline',
      'Budget',
      'Owner',
      'Updated',
    ])
    // Header row + one row per RFP.
    expect(within(table).getAllByRole('row')).toHaveLength(rfpFixtures.length + 1)
    expect(screen.getByRole('status')).toHaveTextContent(
      `${rfpFixtures.length} RFPs in the pipeline`,
    )
  })

  it('shows "Not found" for missing source data instead of inventing values', () => {
    renderWithRouter(<RfpPipelinePage />)
    const row = screen
      .getByRole('link', { name: 'SNAP Enrollment Awareness Toolkit' })
      .closest('tr')
    expect(row).not.toBeNull()
    expect(within(row as HTMLElement).getByText('Not found')).toBeInTheDocument()
    expect(within(row as HTMLElement).getByText('Unassigned')).toBeInTheDocument()
  })

  it('filters by search and recovers from the no-results state', async () => {
    const { user } = renderWithRouter(<RfpPipelinePage />)

    await user.type(screen.getByRole('searchbox', { name: 'Search RFPs' }), 'vaping')
    expect(screen.getByRole('status')).toHaveTextContent(`Showing 1 of ${rfpFixtures.length} RFPs`)
    expect(screen.getByRole('link', { name: 'Youth Vaping Prevention Campaign' })).toHaveAttribute(
      'href',
      '/rfps/rfp-001',
    )

    await user.type(screen.getByRole('searchbox', { name: 'Search RFPs' }), ' nothing matches')
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'No RFPs match these filters' })).toBeInTheDocument()

    const clearButtons = screen.getAllByRole('button', { name: 'Clear filters' })
    await user.click(clearButtons[clearButtons.length - 1]!)
    expect(screen.getByRole('searchbox', { name: 'Search RFPs' })).toHaveValue('')
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('filters by status using the accessible select', async () => {
    const { user } = renderWithRouter(<RfpPipelinePage />)

    await user.click(screen.getByRole('button', { name: /Status/ }))
    await user.click(screen.getByRole('option', { name: 'Declined' }))

    expect(screen.getByRole('status')).toHaveTextContent(`Showing 1 of ${rfpFixtures.length} RFPs`)
    expect(
      screen.getByRole('link', { name: 'Fare Equity Program Community Engagement' }),
    ).toBeInTheDocument()
  })

  it('filters by pursuit decision and shows outcomes only for closed RFPs', async () => {
    const { user } = renderWithRouter(<RfpPipelinePage />)

    await user.click(screen.getByRole('button', { name: /Decision/ }))
    await user.click(screen.getByRole('option', { name: 'Conditional Go' }))
    expect(screen.getByRole('status')).toHaveTextContent(`Showing 1 of ${rfpFixtures.length} RFPs`)

    await user.click(screen.getByRole('button', { name: /Decision/ }))
    await user.click(screen.getByRole('option', { name: 'Go' }))
    const wonRow = screen
      .getByRole('link', { name: 'Patient Portal Adoption Campaign' })
      .closest('tr')
    expect(within(wonRow as HTMLElement).getByText('Closed')).toBeInTheDocument()
    expect(within(wonRow as HTMLElement).getByText('Won')).toBeInTheDocument()
    expect(screen.queryByText('Not applicable')).not.toBeInTheDocument()
  })

  it('shows an empty state with a New RFP action when the pipeline is empty', () => {
    renderWithRouter(<RfpPipelinePage />, {
      repository: createRfpRepository({ fixtures: [], workspaces: [], storage: null }),
    })
    expect(screen.getByRole('heading', { name: 'No RFPs yet' })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'New RFP' })[0]).toHaveAttribute('href', '/rfps/new')
  })
})

function seededRepository(): RfpRepository {
  const repository = createRfpRepository({
    fixtures: rfpFixtures,
    workspaces: rfpWorkspaceFixtures,
    storage: window.localStorage,
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
  const fixture = repository.getById('rfp-003')
  if (!fixture) throw new Error('missing rfp-003')
  repository.update('rfp-003', { ...fixture, client: 'Locally Renamed Coalition' })
  return repository
}

describe('RfpPipelinePage local prototype data', () => {
  it('explains browser-only storage in the local data panel', () => {
    renderWithRouter(<RfpPipelinePage />, { repository: seededRepository() })
    const panel = screen.getByRole('region', { name: 'Local prototype data' })
    expect(within(panel).getByText(PROTOTYPE_STORAGE_NOTICE)).toBeInTheDocument()
    expect(
      within(panel).getByText(
        '1 RFP stored in this browser · 1 built-in sample edited in this browser',
      ),
    ).toBeInTheDocument()
  })

  it('resets local records and edits after confirmation and keeps every fixture', async () => {
    const { user } = renderWithRouter(<RfpPipelinePage />, { repository: seededRepository() })
    expect(screen.getByRole('link', { name: 'Summer Reading Outreach' })).toBeInTheDocument()
    expect(screen.getByText('Locally Renamed Coalition')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Reset local prototype data' }))
    const dialog = screen.getByRole('alertdialog', { name: 'Reset local prototype data?' })
    expect(
      within(dialog).getByText(/every RFP created in this browser and every local edit/),
    ).toBeInTheDocument()
    expect(within(dialog).getByText('The built-in sample records remain.')).toBeInTheDocument()
    expect(within(dialog).getByText('This action can’t be undone.')).toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: 'Cancel' })).toHaveFocus()

    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }))
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Summer Reading Outreach' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Reset local prototype data' }))
    await user.click(screen.getByRole('button', { name: 'Reset local data' }))

    expect(screen.getByText('Local prototype data was reset.')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Summer Reading Outreach' })).not.toBeInTheDocument()
    expect(screen.getByText('Cascadia Food Access Coalition')).toBeInTheDocument()
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(
      rfpFixtures.length + 1,
    )
    expect(window.localStorage.getItem(LOCAL_RFPS_STORAGE_KEY)).toBeNull()
    expect(screen.getByRole('button', { name: 'Reset local prototype data' })).toBeDisabled()
  })

  it('ignores corrupted local data with a notice and keeps showing fixtures', () => {
    window.localStorage.setItem(LOCAL_RFPS_STORAGE_KEY, '{not valid json')
    renderWithRouter(<RfpPipelinePage />)
    expect(screen.getByText('Local prototype data couldn’t be read')).toBeInTheDocument()
    expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(
      rfpFixtures.length + 1,
    )
    expect(screen.getByRole('button', { name: 'Reset local prototype data' })).toBeEnabled()
  })

  it('keeps showing fixtures when browser storage is unavailable', () => {
    renderWithRouter(<RfpPipelinePage />, {
      repository: createRfpRepository({
        fixtures: rfpFixtures,
        workspaces: rfpWorkspaceFixtures,
        storage: createThrowingStorage(),
      }),
    })
    expect(screen.getByText('Browser storage is unavailable')).toBeInTheDocument()
    expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(
      rfpFixtures.length + 1,
    )
    expect(screen.getByRole('button', { name: 'Reset local prototype data' })).toBeDisabled()
  })
})
