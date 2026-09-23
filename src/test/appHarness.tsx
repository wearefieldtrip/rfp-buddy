import { screen } from '@testing-library/react'
import type { UserEvent } from '@testing-library/user-event'
import { AppRoutes } from '@/app/router'
import type { RfpRepository } from '@/features/rfps'
import { LocationProbe } from './LocationProbe'
import { renderWithRouter } from './render'

/** Renders the full route tree plus a path readout and a Back button. */
export function renderApp(
  route: string,
  options: { history?: string[]; repository?: RfpRepository } = {},
) {
  return renderWithRouter(
    <>
      <AppRoutes />
      <LocationProbe />
    </>,
    { route, ...options },
  )
}

export const currentPath = () => screen.getByRole('status', { name: 'Current path' })

export async function chooseOption(user: UserEvent, fieldName: RegExp, option: string) {
  await user.click(screen.getByRole('button', { name: fieldName }))
  await user.click(screen.getByRole('option', { name: option }))
}
