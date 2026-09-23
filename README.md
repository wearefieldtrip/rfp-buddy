# RFP Buddy

Fieldtrip's internal workspace for RFP opportunities and proposals. Fieldtrip is
an agency that works with nonprofit, public-health, and civic clients. RFP Buddy
will help the team evaluate fit, keep question logs, organize responses, reuse
approved content, and run final compliance checks, with a person making every
decision.

> **Status: frontend prototype.** The RFP pipeline, intake, and workspace work
> on built-in sample data plus **browser-only prototype storage**. New RFPs and
> Overview edits are saved in this browser's `localStorage` only: they aren't
> shared with the team, aren't backed up, and aren't secure. There is no auth,
> database, Google integration, or AI.

## Getting started

Requires Node 22.12+ (developed on Node 24) and npm.

```bash
npm install
npm run dev          # http://localhost:5173
```

No environment variables are needed. `.env.example` is a placeholder for later
integrations.

## Browser-only prototype storage

- Locally created RFPs and local edits to built-in samples are stored under the
  `localStorage` key `rfp-buddy.local-rfps.v1` in the current browser.
- Built-in sample records (fixtures) are never modified. Editing one stores a
  local override, labeled **Edited in this browser**. Locally created RFPs are
  labeled **Stored in this browser**, and untouched samples **Built-in sample**.
- **Reset local prototype data** (in the panel below the pipeline) removes local
  RFPs and edits after a confirmation. Built-in samples remain.
- If storage is blocked or the saved data can't be read, the app shows a notice
  and keeps working with the built-in samples.
- This is a temporary prototype mechanism. Don't enter confidential client data.
  It will be replaced by Supabase-backed team storage (see `docs/architecture.md`).

## Commands

| Command              | What it does                                                              |
| -------------------- | ------------------------------------------------------------------------- |
| `npm run dev`        | Start the Vite dev server                                                 |
| `npm run build`      | Type-check and build for production into `dist/`                          |
| `npm run preview`    | Serve the production build locally                                        |
| `npm run lint`       | ESLint (flat config, typescript-eslint, React Hooks, Prettier-compatible) |
| `npm run typecheck`  | `tsc -b`, strict mode                                                     |
| `npm run test`       | Vitest + React Testing Library, single run                                |
| `npm run test:watch` | Vitest in watch mode                                                      |
| `npm run format`     | Prettier, write in place                                                  |

## What works today

| Route                                                               | Status                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/rfps`                                                             | **Working.** The pipeline table (Client, Opportunity, Status, Decision, Proposal deadline, Budget, Owner, Updated) with local search, status and decision filters, a result count, empty states, origin labels for browser-local records, and the local prototype data panel.                                                                                                      |
| `/rfps/new`                                                         | **Working, browser-only.** Validated intake form (React Hook Form + Zod) with inline errors and an error summary. "Save RFP locally" stores the RFP in this browser and opens its workspace.                                                                                                                                                                                       |
| `/rfps/:rfpId/:section?`                                            | **Working.** The RFP workspace, with tabs for Overview, Sources, Requirements, Fit review, Decision, Activity, and Upcoming. Each tab has its own URL, and Back returns to the pipeline. The Overview can be edited (saved in this browser); every other tab is read-only. Three RFPs have detailed fixtures; the rest show honest empty states. Unknown IDs show "RFP not found". |
| `/question-library`, `/content-library`, `/compliance`, `/settings` | Placeholder pages.                                                                                                                                                                                                                                                                                                                                                                 |
| anything else                                                       | 404 page                                                                                                                                                                                                                                                                                                                                                                           |

Missing values are never guessed. Absent source facts (deadlines, budget) show
_Not found_; internal details nobody has supplied yet (owner, sector, service
areas, scope) show _Needs review_.

## Stack

- **React 19 + TypeScript + Vite**
- **Tailwind CSS v4** via `@tailwindcss/vite`. Design tokens live in `src/styles/globals.css`.
- **React Aria Components** for accessible behavior (focus, keyboard, ARIA).
- **`@untitledui/icons`** for icons.
- **A small custom UI primitive layer** in `src/components/ui`, styled to loosely
  follow Untitled UI's look. These are our own components, **not** Untitled UI
  React source.
- **React Router** (`react-router` package, declarative mode with `<BrowserRouter>`).
- **React Hook Form + Zod** (with `@hookform/resolvers`) for the intake and
  Overview edit forms, and Zod again to validate data read back from browser
  storage.
- **Vitest + React Testing Library**, **ESLint + Prettier**.

Deliberately not included yet: TanStack Query, Supabase, Google APIs, and AI
SDKs. Each one is added with the feature that needs it. See
`docs/architecture.md`.

## Project layout

```
src/
  app/          App root, providers, routes
  components/
    ui/         Generic primitives (Button, Badge, Input, Select, Table, Tabs, …)
    layout/     App shell, sidebar, header, page header
    shared/     Generic composites (EmptyState, StatusBadge, SearchInput, …)
    rfp/        RFP-specific presentational components
  features/     Feature modules. `rfps` holds types, fixtures, workflow rules, the
                repository (browser storage), and form schema; the rest are README placeholders
  pages/        Route-level screens
  lib/          Constants, utilities, and future integration placeholders
  routes/       Path constants
  styles/       Tailwind entry and theme tokens
  test/         Test setup and helpers
docs/           Product, architecture, and guardrail docs, plus ADRs
supabase/       Placeholder only. Nothing configured.
```

## Documentation

- [`CLAUDE.md`](CLAUDE.md): working rules for contributors and AI coding agents
- [`docs/product-brief.md`](docs/product-brief.md)
- [`docs/architecture.md`](docs/architecture.md)
- [`docs/data-model.md`](docs/data-model.md)
- [`docs/rfp-workflow.md`](docs/rfp-workflow.md)
- [`docs/security-and-permissions.md`](docs/security-and-permissions.md)
- [`docs/ai-guardrails.md`](docs/ai-guardrails.md)
- [`docs/acceptance-criteria.md`](docs/acceptance-criteria.md)
- [`docs/decisions/`](docs/decisions/): architecture decision records
