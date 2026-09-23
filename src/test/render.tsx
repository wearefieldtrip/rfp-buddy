import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement } from 'react'
import { MemoryRouter } from 'react-router'
import { AppProviders } from '@/app/providers'

export function renderWithRouter(ui: ReactElement, { route = '/' }: { route?: string } = {}) {
  return {
    user: userEvent.setup(),
    ...render(
      <MemoryRouter initialEntries={[route]}>
        <AppProviders>{ui}</AppProviders>
      </MemoryRouter>,
    ),
  }
}
