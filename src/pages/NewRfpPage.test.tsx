import { cleanup, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { rfpFixtures } from '@/features/rfps'
import { LOCAL_RFPS_STORAGE_KEY, PROTOTYPE_STORAGE_NOTICE } from '@/lib/constants/storage'
import { chooseOption, currentPath, renderApp } from '@/test/appHarness'

const textbox = (name: string) => screen.getByRole('textbox', { name })

describe('NewRfpPage intake', () => {
  it('shows the prototype storage notice', () => {
    renderApp('/rfps/new')
    expect(screen.getByText(PROTOTYPE_STORAGE_NOTICE)).toBeInTheDocument()
  })

  it('creates a local RFP, opens its workspace, and adds it to the pipeline', async () => {
    const { user } = renderApp('/rfps/new', { history: ['/rfps', '/rfps/new'] })

    await user.type(textbox('Organization / client'), 'Eastside Library Foundation')
    await user.type(textbox('Opportunity title'), 'Summer Reading Outreach')
    await chooseOption(user, /Sector/, 'Foundation')
    await user.type(screen.getByLabelText('Proposal deadline'), '2026-12-01')
    await user.type(textbox('Budget minimum (USD)'), '20000')
    await user.type(textbox('Budget maximum (USD)'), '30,000')
    await user.type(textbox('Budget context / note'), 'Over 2 years')
    await user.click(screen.getByRole('checkbox', { name: 'Community engagement' }))
    await user.click(screen.getByRole('button', { name: 'Save RFP locally' }))

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Summer Reading Outreach' }),
    ).toBeInTheDocument()
    expect(currentPath().textContent).toMatch(/^\/rfps\/local-/)
    expect(screen.getByText('Stored in this browser', { selector: 'span' })).toBeInTheDocument()
    expect(
      screen.getByText(
        'This RFP is stored locally in this browser and is not shared with your team.',
      ),
    ).toBeInTheDocument()

    const overview = screen.getByRole('tabpanel', { name: 'Overview' })
    expect(within(overview).getByText('Foundation')).toBeInTheDocument()
    expect(within(overview).getByText('$20,000–$30,000')).toBeInTheDocument()
    expect(within(overview).getByText('· Over 2 years')).toBeInTheDocument()
    // Blank question deadline is a source fact that's absent; blank owner needs review.
    expect(within(overview).getAllByText('Not found').length).toBeGreaterThan(0)
    expect(within(overview).getAllByText('Needs review').length).toBeGreaterThan(0)

    // Intake replaced its history entry, so Back goes to the pipeline.
    await user.click(screen.getByRole('button', { name: 'Browser back' }))
    expect(currentPath()).toHaveTextContent(/^\/rfps$/)
    const row = screen.getByRole('link', { name: 'Summer Reading Outreach' }).closest('tr')
    expect(within(row as HTMLElement).getByText('Stored in this browser')).toBeInTheDocument()
    expect(within(row as HTMLElement).getByText('Received')).toBeInTheDocument()
    expect(within(row as HTMLElement).getByText('Not decided')).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(rfpFixtures.length + 2)
  })

  it('keeps a created RFP after a simulated browser reload', async () => {
    const { user } = renderApp('/rfps/new')
    await user.type(textbox('Organization / client'), 'Eastside Library Foundation')
    await user.type(textbox('Opportunity title'), 'Summer Reading Outreach')
    await user.click(screen.getByRole('button', { name: 'Save RFP locally' }))
    await screen.findByRole('heading', { level: 1, name: 'Summer Reading Outreach' })
    const path = currentPath().textContent ?? ''

    // Unmount everything and start again from browser storage alone.
    cleanup()
    renderApp(path)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Summer Reading Outreach' }),
    ).toBeInTheDocument()
    cleanup()
    renderApp('/rfps')
    expect(screen.getByRole('link', { name: 'Summer Reading Outreach' })).toBeInTheDocument()
  })

  it('shows an accessible error summary and inline errors, and saves nothing', async () => {
    const { user } = renderApp('/rfps/new')
    await user.click(screen.getByRole('button', { name: 'Save RFP locally' }))

    const summary = await screen.findByRole('alert')
    expect(
      within(summary).getByRole('heading', { name: 'Fix 2 problems before saving' }),
    ).toBeInTheDocument()
    expect(summary).toHaveFocus()
    expect(
      within(summary).getByRole('link', { name: /Organization \/ client/ }),
    ).toBeInTheDocument()

    expect(textbox('Organization / client')).toHaveAttribute('aria-invalid', 'true')
    expect(textbox('Organization / client')).toHaveAccessibleDescription(
      /Enter the organization \/ client\./,
    )
    expect(textbox('Opportunity title')).toHaveAttribute('aria-invalid', 'true')

    await user.click(within(summary).getByRole('link', { name: /Opportunity title/ }))
    expect(textbox('Opportunity title')).toHaveFocus()

    expect(currentPath()).toHaveTextContent('/rfps/new')
    expect(window.localStorage.getItem(LOCAL_RFPS_STORAGE_KEY)).toBeNull()
  })

  it('rejects a budget maximum lower than the minimum', async () => {
    const { user } = renderApp('/rfps/new')
    await user.type(textbox('Organization / client'), 'Eastside Library Foundation')
    await user.type(textbox('Opportunity title'), 'Summer Reading Outreach')
    await user.type(textbox('Budget minimum (USD)'), '50000')
    await user.type(textbox('Budget maximum (USD)'), '40000')
    await user.click(screen.getByRole('button', { name: 'Save RFP locally' }))

    expect(within(await screen.findByRole('alert')).getByText(/Budget maximum/)).toBeInTheDocument()
    expect(textbox('Budget maximum (USD)')).toHaveAttribute('aria-invalid', 'true')
    expect(textbox('Budget maximum (USD)')).toHaveAccessibleDescription(
      /can’t be lower than the budget minimum/,
    )
    expect(window.localStorage.getItem(LOCAL_RFPS_STORAGE_KEY)).toBeNull()
  })

  it('rejects a decision the lifecycle status does not allow', async () => {
    const { user } = renderApp('/rfps/new')
    await user.type(textbox('Organization / client'), 'Eastside Library Foundation')
    await user.type(textbox('Opportunity title'), 'Summer Reading Outreach')
    expect(screen.getByText('Received allows: Not decided.')).toBeInTheDocument()
    await chooseOption(user, /Pursuit decision/, 'Go')
    await user.click(screen.getByRole('button', { name: 'Save RFP locally' }))

    expect(
      within(await screen.findByRole('alert')).getByText(
        /Received can't be used with the decision Go/,
      ),
    ).toBeInTheDocument()
    expect(window.localStorage.getItem(LOCAL_RFPS_STORAGE_KEY)).toBeNull()
  })
})
