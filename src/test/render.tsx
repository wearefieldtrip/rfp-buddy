import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement } from 'react'
import { MemoryRouter } from 'react-router'
import { AppProviders } from '@/app/providers'
import type { RfpRepository } from '@/features/rfps'

interface RenderOptions {
  route?: string
  /** Full history stack; overrides `route`. The last entry is the current location. */
  history?: string[]
  /** Defaults to a fresh repository over the fixtures and jsdom's localStorage. */
  repository?: RfpRepository
}

export function renderWithRouter(
  ui: ReactElement,
  { route = '/', history, repository }: RenderOptions = {},
) {
  const entries = history ?? [route]
  return {
    user: userEvent.setup(),
    ...render(
      <MemoryRouter initialEntries={entries} initialIndex={entries.length - 1}>
        <AppProviders repository={repository}>{ui}</AppProviders>
      </MemoryRouter>,
    ),
  }
}
