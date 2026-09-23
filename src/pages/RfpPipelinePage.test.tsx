import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { rfpFixtures } from '@/features/rfps'
import { renderWithRouter } from '@/test/render'
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
    renderWithRouter(<RfpPipelinePage rfps={[]} />)
    expect(screen.getByRole('heading', { name: 'No RFPs yet' })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'New RFP' })[0]).toHaveAttribute('href', '/rfps/new')
  })
})
