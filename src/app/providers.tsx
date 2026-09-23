import { useState, type ReactNode } from 'react'
import { RouterProvider } from 'react-aria-components'
import { useHref, useNavigate, type NavigateOptions } from 'react-router'
import {
  createRfpRepository,
  getBrowserStorage,
  rfpFixtures,
  rfpWorkspaceFixtures,
  RfpRepositoryProvider,
  type RfpRepository,
} from '@/features/rfps'

declare module 'react-aria-components' {
  interface RouterConfig {
    routerOptions: NavigateOptions
  }
}

interface AppProvidersProps {
  children: ReactNode
  /** Injected in tests; otherwise built once from fixtures and browser storage. */
  repository?: RfpRepository
}

/** App-wide providers. Must render inside React Router's <BrowserRouter>. */
export function AppProviders({ children, repository }: AppProvidersProps) {
  const navigate = useNavigate()
  const [rfpRepository] = useState(
    () =>
      repository ??
      createRfpRepository({
        fixtures: rfpFixtures,
        workspaces: rfpWorkspaceFixtures,
        storage: getBrowserStorage(),
      }),
  )

  // Lets React Aria links (e.g. LinkButton) navigate client-side via React Router.
  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      <RfpRepositoryProvider repository={rfpRepository}>{children}</RfpRepositoryProvider>
    </RouterProvider>
  )
}
