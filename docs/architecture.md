# Architecture

## Now: a frontend-only foundation

A single-page React app served by Vite. It has no backend, network calls,
persistence, or auth. Data comes from fictional fixtures that are bundled with
the app.

```
main.tsx
 └─ <BrowserRouter>                 react-router, declarative mode
     └─ <App>
         └─ <AppProviders>          React Aria RouterProvider → React Router navigate
             └─ <AppRoutes>         <Routes> tree (app/router.tsx)
                 └─ <AppShell>      sidebar + header + <Outlet>
                     └─ pages/*     compose components + feature modules
```

### Directory responsibilities

| Path                    | Responsibility                                                                                                    | May import from                              |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `src/app`               | Root component, providers, route table                                                                            | everything                                   |
| `src/pages`             | One component per route. Composes, holds no domain logic.                                                         | components, features, lib, routes            |
| `src/components/ui`     | Generic primitives: `Button`/`LinkButton`, `Badge`, `Input`, `Table`, `Select`                                    | `lib/utils`, `types`                         |
| `src/components/shared` | Generic composites: `EmptyState`, `StatusBadge`, `SearchInput`, `DataTablePlaceholder`                            | `components/ui`, `lib/utils`, `types`        |
| `src/components/layout` | App shell, sidebar, header, page header                                                                           | ui, shared, routes                           |
| `src/components/rfp`    | RFP presentational components (pipeline table, filters, status and decision badges)                               | ui, shared, `features/rfps`, `lib/constants` |
| `src/features/<name>`   | Feature module: types, data access, feature logic, and later hooks and components. Public API through `index.ts`. | lib, types                                   |
| `src/lib`               | Framework-free foundations: constants, utils, and future integration clients                                      | `types` only                                 |
| `src/routes/paths.ts`   | Path constants and builders                                                                                       | nothing                                      |
| `src/types`             | Cross-cutting types (`Tone`, `IsoDateString`)                                                                     | nothing                                      |

`src/components/rfp` holds RFP components that pages share. `features/rfps/components`
is kept for components that stay inside the feature (for example, intake form
sections) once they exist.

### UI system

- **Tailwind CSS v4** through `@tailwindcss/vite`. Tokens (neutral scale, one
  accent, success, warning, and danger tones, radii) are declared with `@theme`
  in `src/styles/globals.css`.
- **React Aria Components** supply focus management, keyboard behavior, and ARIA
  semantics. We style them with data-attribute variants such as
  `data-focus-visible:`, `data-hovered:`, and `data-selected:`. We don't use
  `tailwindcss-react-aria-components`.
- **`@untitledui/icons`** for icons.
- **Our own primitive layer.** `src/components/ui` is a small set of components
  we wrote, styled to loosely follow Untitled UI's look. It is **not** Untitled
  UI React. If we later license and import official Untitled UI React source, we
  will record that in an ADR and update this section.

### Routing

We use the unified **`react-router`** package (v8 at the time of writing; the
`react-router-dom` package is no longer used). The official docs describe three
modes:

| Mode                     | Entry point                                                             | Why not / why                                                                         |
| ------------------------ | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Framework                | `@react-router/dev` Vite plugin, file routes, loaders, and optional SSR | Brings a server and build model we don't need yet                                     |
| Data                     | `createBrowserRouter` + `<RouterProvider>`                              | Loaders and actions pay off once we have a data layer. We may adopt it with Supabase. |
| **Declarative** (chosen) | `<BrowserRouter>` + `<Routes>`/`<Route>`                                | The simplest official option for a client-only Vite SPA with no data loading          |

The official declarative-mode setup: `npm i react-router`, then wrap the app in
`<BrowserRouter>` imported from `"react-router"`. See
https://reactrouter.com/start/declarative/installation.

React Aria's `RouterProvider` is wired to React Router's `useNavigate` and
`useHref`, so `LinkButton` and other React Aria links navigate client-side.

### State

- UI state (filters) lives in local `useState`.
- Fixture data is imported synchronously. We have no async server state yet,
  so there is **no TanStack Query**.

### Testing

Vitest (jsdom) + React Testing Library + user-event. Tests sit next to the code
they cover. `src/test/render.tsx` provides `renderWithRouter`, which uses
`MemoryRouter` and `AppProviders`.

## Later: target architecture

```
Browser (this React app)
   │  supabase-js (anon key + user JWT)
   ▼
Supabase
   ├─ Auth           Google sign-in, limited to the Fieldtrip Workspace domain
   ├─ Postgres       system of record, with RLS on every table
   ├─ Edge Functions all privileged work: Google API calls, AI calls, token handling
   └─ Storage        not planned for RFP files (those stay in Drive)
        │
        ├──► Google Drive / Docs / Slides   file storage for originals and generated artifacts
        └──► AI provider                    extraction, scoring, drafting (server-side only)
```

We'll add these libraries along with it:

| Addition                                  | Trigger                                                                      |
| ----------------------------------------- | ---------------------------------------------------------------------------- |
| `@supabase/supabase-js` + generated types | First persisted feature (RFP intake)                                         |
| TanStack Query                            | Same change: server state with caching, invalidation, and optimistic updates |
| React Hook Form + Zod                     | Same change: the intake form and validating API responses                    |
| React Router data mode (optional)         | If route loaders simplify data fetching                                      |

Constraints that won't change:

- No secret ever reaches the browser bundle. Google OAuth tokens and AI keys stay
  server-side.
- Every external write goes through an explicit confirmation step in the UI and
  an audited server call. See ADR 0003.
- Authorization is enforced by Postgres RLS. UI checks are only a convenience.
