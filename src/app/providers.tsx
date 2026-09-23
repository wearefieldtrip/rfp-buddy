import type { ReactNode } from 'react'
import { RouterProvider } from 'react-aria-components'
import { useHref, useNavigate, type NavigateOptions } from 'react-router'

declare module 'react-aria-components' {
  interface RouterConfig {
    routerOptions: NavigateOptions
  }
}

/** App-wide providers. Must render inside React Router's <BrowserRouter>. */
export function AppProviders({ children }: { children: ReactNode }) {
  const navigate = useNavigate()

  // Lets React Aria links (e.g. LinkButton) navigate client-side via React Router.
  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      {children}
    </RouterProvider>
  )
}
