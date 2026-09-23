import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithRouter } from '@/test/render'
import { AppRoutes } from './router'

describe('AppRoutes', () => {
  it('redirects / to the RFP pipeline', () => {
    renderWithRouter(<AppRoutes />, { route: '/' })
    expect(screen.getByRole('heading', { level: 1, name: 'RFP Pipeline' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'RFPs' })).toHaveAttribute('aria-current', 'page')
  })

  it('renders an RFP detail page with the workspace placeholder', () => {
    renderWithRouter(<AppRoutes />, { route: '/rfps/rfp-004' })
    expect(
      screen.getByRole('heading', { level: 1, name: 'Safe Sleep Statewide Media Campaign' }),
    ).toBeInTheDocument()
    expect(screen.getByText('RFP workspace coming next')).toBeInTheDocument()
  })

  it('handles an unknown RFP id', () => {
    renderWithRouter(<AppRoutes />, { route: '/rfps/does-not-exist' })
    expect(screen.getByRole('heading', { level: 1, name: 'RFP not found' })).toBeInTheDocument()
  })

  it('labels the new RFP page as a non-persistent preview', () => {
    renderWithRouter(<AppRoutes />, { route: '/rfps/new' })
    expect(screen.getByRole('heading', { level: 1, name: 'New RFP' })).toBeInTheDocument()
    expect(screen.getByText(/Nothing here is saved/)).toBeInTheDocument()
  })

  it('renders placeholder sections', () => {
    renderWithRouter(<AppRoutes />, { route: '/compliance' })
    expect(screen.getByRole('heading', { level: 1, name: 'Compliance' })).toBeInTheDocument()
    expect(screen.getByText('Compliance is not available yet')).toBeInTheDocument()
  })

  it('renders a 404 for unknown routes', () => {
    renderWithRouter(<AppRoutes />, { route: '/nope' })
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument()
  })
})
