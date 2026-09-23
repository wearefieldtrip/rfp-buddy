import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement } from 'react'
import { MemoryRouter } from 'react-router'
import { AppProviders } from '@/app/providers'

interface RenderOptions {
  route?: string
  /** Full history stack; overrides `route`. The last entry is the current location. */
  history?: string[]
}

export function renderWithRouter(ui: ReactElement, { route = '/', history }: RenderOptions = {}) {
  const entries = history ?? [route]
  return {
    user: userEvent.setup(),
    ...render(
      <MemoryRouter initialEntries={entries} initialIndex={entries.length - 1}>
        <AppProviders>{ui}</AppProviders>
      </MemoryRouter>,
    ),
  }
}
