import { Outlet } from 'react-router'
import { AppHeader } from './AppHeader'
import { AppSidebar } from './AppSidebar'

export function AppShell() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-white px-3 py-2 text-sm font-medium focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:ring-2 focus:ring-accent-500"
      >
        Skip to main content
      </a>
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader />
        <main id="main-content" tabIndex={-1} className="flex-1 px-6 py-8 outline-none lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
