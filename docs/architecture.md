# Architecture

## Now: a frontend-only prototype

A single-page React app served by Vite. It has no backend, network calls, or
auth. Data comes from fictional fixtures bundled with the app, plus
**browser-only prototype storage** (`localStorage`) for RFPs created or edited
in this browser. Nothing is shared with the team.

```
main.tsx
 └─ <BrowserRouter>                 react-router, declarative mode
     └─ <App>
         └─ <AppProviders>          React Aria RouterProvider → React Router navigate
             │                      RfpRepositoryProvider (fixtures + browser storage)
             └─ <AppRoutes>         <Routes> tree (app/router.tsx)
                 └─ <AppShell>      sidebar + header + <Outlet>
                     └─ pages/*     compose components + feature modules
```

### Directory responsibilities

| Path                           | Responsibility                                                                                                                                       | May import from                                      |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `src/app`                      | Root component, providers, route table                                                                                                               | everything                                           |
| `src/pages`                    | One component per route. Composes, holds no domain logic.                                                                                            | components, features, lib, routes                    |
| `src/components/ui`            | Generic primitives: `Button`/`LinkButton`, `Badge`, `Input`, `TextArea`, `Select`, `CheckboxGroup`, `Table`, `Tabs`, `ModalDialog`                   | `lib/utils`, `types`                                 |
| `src/components/shared`        | Generic composites: `EmptyState`, `StatusBadge`, `SearchInput`, `DataTablePlaceholder`, `MissingValue`, `Notice`                                     | `components/ui`, `lib/utils`, `types`                |
| `src/components/layout`        | App shell, sidebar, header, page header                                                                                                              | ui, shared, routes                                   |
| `src/components/rfp`           | RFP components: pipeline table, filters, badges (status, decision, outcome, origin), the intake/edit form, and the local-data panel and reset dialog | ui, shared, `features/rfps`, `lib`                   |
| `src/components/rfp/workspace` | The RFP detail workspace: tab container and one component per section                                                                                | ui, shared, `components/rfp`, `features/rfps`, `lib` |
| `src/features/<name>`          | Feature module: types, fixtures, rules, data access, form schemas, and hooks. Public API through `index.ts`.                                         | lib, types                                           |
| `src/lib`                      | Framework-free foundations: constants (domain vocabulary), utils (`cn`, `formatDate`), and future integration clients                                | `types` only                                         |
| `src/routes/paths.ts`          | Path constants and builders                                                                                                                          | `lib/constants` (types only)                         |
| `src/types`                    | Cross-cutting types (`Tone`, `IsoDateString`)                                                                                                        | nothing                                              |

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

#### RFP workspace tabs

- The detail route is `/rfps/:rfpId/:section?` (`paths.rfpDetailPattern`). Section
  keys come from `RFP_WORKSPACE_SECTIONS` in `src/lib/constants/rfpWorkspace.ts`.
  Build URLs with `paths.rfpDetail(rfpId, section)`. Overview has no segment.
- The URL is the source of truth for the selected tab: React Aria `Tabs` is
  controlled by `selectedKey`, and `onSelectionChange` calls
  `navigate(..., { replace: true })`.
- Replacing (rather than pushing) history means browser Back leaves the
  workspace and returns to the pipeline instead of stepping back through tabs.
  The trade-off is that tabs are buttons, so they can't be middle-clicked into a
  new window. Every tab's URL can still be copied and shared.
- Unknown sections redirect (with replace) to the overview URL. Unknown RFP IDs
  show the not-found state.

### Data access: the RFP repository

All RFP data flows through one typed boundary in `src/features/rfps/repository/`:

```
pages / components
   │  useRfpData()  → { rfps, storageStatus, localSummary }   (useSyncExternalStore)
   │  useRfpRepository() → create / update / removeLocal / resetLocalData / getWorkspace
   ▼
rfpRepository.ts   merges fixtures + local creations + local overrides; applies workflow rules
   ▼
localRfpStore.ts   the ONLY code that touches localStorage; Zod-validates everything it reads
   ▼
localStorage["rfp-buddy.local-rfps.v1"] = { version: 1, created: [...], overrides: { [fixtureId]: {...} } }
```

- **Fixtures are immutable.** The repository copies them once and never writes
  to them. Editing a fixture stores an override of its editable fields; the
  decision is never overridden (the Decision tab owns it).
- **Merged records** carry `dataOrigin: 'fixture' | 'local'` and
  `isLocallyEdited`, which drive the origin labels (Built-in sample, Edited in
  this browser, Stored in this browser).
- **Workflow rules** (`src/features/rfps/workflowRules.ts`) are enforced in the
  repository as well as the form: an incompatible status and decision is
  rejected, and outcome is normalized from status.
- **Failure handling.** If `localStorage` is blocked, reads return fixtures only
  and writes return a typed `storage_unavailable` or `write_failed` error. If
  the stored data can't be parsed or fails validation, it's ignored (status
  `corrupted`) and replaced by the next successful save or reset. Both states
  show a non-blocking notice.
- **No global state library.** The repository is a small subscribable store,
  created once in `AppProviders` and injectable in tests.

### Forms

- React Hook Form with `zodResolver`. One schema factory,
  `createRfpFormSchema(mode)`, serves intake (`create`) and Overview edit
  (`edit`). It trims and length-checks text, turns blanks into `null`, parses
  whole-dollar budgets (commas allowed), and applies the cross-field rules
  (budget max ≥ min, allowed status/decision).
- `RfpForm` renders React Aria fields through `Controller`, inline errors via
  `FieldError` (so `aria-invalid` and descriptions are wired), and an error
  summary with links that receives focus after an invalid submit.
- After creating an RFP, intake navigates to the new workspace with history
  _replace_, so Back returns to the pipeline.

### State

- UI state (filters, Overview edit mode) lives in local `useState`. The selected
  workspace tab lives in the URL.
- RFP data comes from the repository snapshot. It's synchronous, so there is
  still **no TanStack Query**.
- Pipeline data (`rfpFixtures`) and workspace data (`rfpWorkspaceFixtures`) are
  separate files joined by RFP ID. The decision _value_ exists only on `Rfp`, and
  the workspace's `DecisionRecord` holds details only, so the list and the
  workspace can't show different decisions. `fixtures.test.ts` also checks that
  status, decision, and outcome combinations follow `docs/rfp-workflow.md`.

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
| `@supabase/supabase-js` + generated types | Replacing browser-only storage with team storage                             |
| TanStack Query                            | Same change: server state with caching, invalidation, and optimistic updates |
| React Router data mode (optional)         | If route loaders simplify data fetching                                      |

React Hook Form and Zod are already in place; the same form schema will be
reused for Supabase-backed intake.

### Replacing browser storage with Supabase

The repository boundary exists so this swap doesn't touch pages:

1. Add a Supabase-backed implementation of the `RfpRepository` operations
   (async, behind TanStack Query hooks with the same shape as `useRfpData`).
2. Seed the database from the fictional fixtures for local development only.
3. Remove `localRfpStore.ts`, the reset panel, and the origin labels, or keep a
   one-time "import my local prototype records" step if the team wants it. Never
   import silently.
4. Keep `workflowRules.ts` as the client-side mirror of rules enforced by
   Postgres constraints and RLS.

Constraints that won't change:

- No secret ever reaches the browser bundle. Google OAuth tokens and AI keys stay
  server-side.
- Every external write goes through an explicit confirmation step in the UI and
  an audited server call. See ADR 0003.
- Authorization is enforced by Postgres RLS. UI checks are only a convenience.
