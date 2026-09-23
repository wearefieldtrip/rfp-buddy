# RFP Buddy

Fieldtrip's internal workspace for RFP opportunities and proposals. Fieldtrip is
an agency that works with nonprofit, public-health, and civic clients. RFP Buddy
will help the team evaluate fit, keep question logs, organize responses, reuse
approved content, and run final compliance checks, with a person making every
decision.

> **Status: frontend foundation.** Only the RFP pipeline works, and it runs on
> local sample data. Nothing persists. There is no auth, database, Google
> integration, or AI.

## Getting started

Requires Node 22.12+ (developed on Node 24) and npm.

```bash
npm install
npm run dev          # http://localhost:5173
```

No environment variables are needed. `.env.example` is a placeholder for later
integrations.

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

| Route                                                               | Status                                                                                                                                                                                               |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/rfps`                                                             | **Working.** The pipeline table (Client, Opportunity, Status, Decision, Proposal deadline, Budget, Owner, Updated) with local search, status and decision filters, a result count, and empty states. |
| `/rfps/new`                                                         | Static preview. Clearly labeled as not saving anything.                                                                                                                                              |
| `/rfps/:rfpId`                                                      | RFP title, client, and badges, plus a "workspace coming next" placeholder. Unknown IDs show "RFP not found".                                                                                         |
| `/question-library`, `/content-library`, `/compliance`, `/settings` | Placeholder pages.                                                                                                                                                                                   |
| anything else                                                       | 404 page                                                                                                                                                                                             |

Missing source values show as _Not found_ rather than a guessed value.

## Stack

- **React 19 + TypeScript + Vite**
- **Tailwind CSS v4** via `@tailwindcss/vite`. Design tokens live in `src/styles/globals.css`.
- **React Aria Components** for accessible behavior (focus, keyboard, ARIA).
- **`@untitledui/icons`** for icons.
- **A small custom UI primitive layer** in `src/components/ui`, styled to loosely
  follow Untitled UI's look. These are our own components, **not** Untitled UI
  React source.
- **React Router** (`react-router` package, declarative mode with `<BrowserRouter>`).
- **Vitest + React Testing Library**, **ESLint + Prettier**.

Deliberately not included yet: TanStack Query, React Hook Form, Zod, Supabase,
Google APIs, and AI SDKs. Each one is added with the feature that needs it. See
`docs/architecture.md`.

## Project layout

```
src/
  app/          App root, providers, routes
  components/
    ui/         Generic primitives (Button, Badge, Input, Table, Select)
    layout/     App shell, sidebar, header, page header
    shared/     Generic composites (EmptyState, StatusBadge, SearchInput, …)
    rfp/        RFP-specific presentational components
  features/     Feature modules; only `rfps` has code, the rest are README placeholders
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
