# CLAUDE.md

Instructions for AI coding agents and human contributors working in this repo.
Read this first, then the doc relevant to your task in `docs/`.

## What this is

RFP Buddy is Fieldtrip's internal workspace for RFP opportunities and proposals
(Fieldtrip serves nonprofit, public-health, and civic clients). **Current state:
a frontend-only prototype.** Built-in fixtures plus browser-only `localStorage`
prototype storage for new RFPs and Overview edits. There is no backend, auth,
or team persistence.

## Product boundaries (non-negotiable)

1. **Human in the loop.** AI may recommend, extract, and draft. People make every
   final decision and approve every external action.
2. **Never invent data.** When a value isn't in the source, show "Not found" or
   "Needs review" (`NOT_FOUND_LABEL` / `NEEDS_REVIEW_LABEL` in
   `src/lib/constants/rfp.ts`). Never use a plausible placeholder.
3. **Reuse only approved content.** Content is reusable only with an explicit
   `approved` reuse status.
4. **No external action without confirmation.** Never create or modify a
   document, send an email, or submit anything without an explicit human
   confirmation step in the UI.
5. **No secrets in the repo.** No API keys, OAuth tokens, service-role keys, or
   production credentials, in code or in `.env.example`.
6. **Roles of each system.** The app will be the system of record for workflow,
   requirements, decisions, audit, and content metadata. Google Drive stores
   files (original RFPs, generated Docs and Slides). See `docs/decisions/`.

## Stack

- React 19, TypeScript (strict), Vite
- Tailwind CSS v4 (`@tailwindcss/vite`). Theme tokens are in `src/styles/globals.css`.
- React Aria Components for interactive behavior and accessibility
- `@untitledui/icons` for icons
- React Router, from the unified `react-router` package in **declarative mode**:
  `<BrowserRouter>` in `main.tsx`, `<Routes>` in `app/router.tsx`. Import from
  `"react-router"`, never `react-router-dom`.
- React Hook Form + Zod (+ `@hookform/resolvers`) for forms; Zod also validates
  anything read from browser storage
- Vitest + React Testing Library + jsdom
- ESLint (flat config) + Prettier

### About Untitled UI

We do **not** use Untitled UI React components. `src/components/ui` is our own
small set of primitives, built on Tailwind and React Aria Components and styled
to loosely follow Untitled UI's look. Only `@untitledui/icons` (open source) is
installed. Don't describe the app as using Untitled UI React unless official
component source has been imported under its license.

### Not yet installed. Don't add them without the feature that needs them.

| Library                        | Add when                                                        |
| ------------------------------ | --------------------------------------------------------------- |
| TanStack Query                 | Supabase-backed data access (the first real async server state) |
| Supabase, Google APIs, AI SDKs | Their integration is explicitly scheduled                       |

Also out of scope until requested: real auth, OCR, embeddings, vector search,
file uploads, background jobs, server or API routes, and deployment infrastructure.

## Architecture rules

- **One UI system.** Tailwind + React Aria Components + our primitives. Don't add
  MUI, Chakra, shadcn, Headless UI, or a second icon set.
- **Layering:**
  - `components/ui` holds generic primitives and knows nothing about RFPs.
  - `components/shared` holds generic composites.
  - `components/rfp` and `features/rfps` hold RFP logic.
  - `pages` compose those.
  - `lib` must not import from `features` or `components`.
- **Central domain vocabulary.** RFP status, decision, outcome, and sector unions,
  and their labels and tones, live in `src/lib/constants/rfp.ts`. Workspace
  vocabulary (sections, requirement types and statuses, fit dimensions and
  ratings, source-document and activity types, service areas) lives in
  `src/lib/constants/rfpWorkspace.ts`. Don't hard-code these strings or badge
  colors anywhere else.
- **Status, decision, and outcome are separate.** Status is the lifecycle
  (Received → Evaluating → Pursuing → Submitted → Closed, or Declined/Withdrawn).
  Decision is the human go/no-go judgment (Not decided, Go, Conditional Go,
  No-Go, Needs Internal Input). Outcome is the final disposition (Won, Lost,
  Declined, Withdrawn, Unknown, Not applicable). Never use Pursue, Won, or Lost
  as a decision. See `docs/rfp-workflow.md` for the allowed combinations.
- **All RFP data goes through the repository.** Pages and components use
  `useRfpData()` / `useRfpRepository()` from `@/features/rfps`. Never read or
  write `localStorage` outside `src/features/rfps/repository/localRfpStore.ts`,
  and never import fixtures into pages. The repository merges fixtures, local
  creations, and local overrides, and exposes `list`, `getById`, `create`,
  `update`, `removeLocal`, and `resetLocalData`.
- **Fixtures are immutable.** Editing a fixture stores a local override; it never
  changes `rfpFixtures`. Every merged record carries `dataOrigin`
  (`fixture` | `local`) and `isLocallyEdited`.
- **Browser storage is a prototype, not a security boundary.** Anything in
  `localStorage` can be read or changed by anyone with the browser. Never store
  secrets there, and don't treat it as team data. Bump the key version
  (`LOCAL_RFPS_STORAGE_KEY` in `src/lib/constants/storage.ts`) on incompatible
  shape changes.
- **Workflow rules are canonical.** Allowed status/decision pairs and outcome
  normalization live in `src/features/rfps/workflowRules.ts`. The repository,
  form schema, UI hints, and fixture tests all use it. Don't re-implement them.
- **Decision is owned by the Decision tab.** Intake may set the initial decision;
  the Overview edit form must not change it.
- **Feature modules** live under `src/features/<name>/` and export through
  `index.ts`. Deferred features are a `README.md` only. Don't create empty
  implementation files for features that don't exist yet.
- **Routes:** build URLs with `src/routes/paths.ts`, not string literals.
- **Navigation inside React Aria components** (`LinkButton`, `Link`) goes through
  React Router via `AppProviders` (`src/app/providers.tsx`). Use `LinkButton` for
  navigation and `Button` for in-page actions.
- **Fixtures are fictional.** Never add real client names, contacts, or proposal
  content to the repo.

## Code conventions

- No `any` (ESLint enforces it). Prefer `as const` arrays and derived unions.
- `strict` and `noUncheckedIndexedAccess` are on. Handle `undefined` rather than
  using `!`, except in tests.
- Import from `src` with the `@/` alias.
- Every interactive control needs an accessible name (visible label, or `sr-only`
  via `hideLabel`) and a visible keyboard focus style.
- Every list view needs a useful empty state.
- Keep comments rare and about _why_.
- Prettier formats: no semicolons, single quotes, width 100.

## Before you finish a change

```bash
npm run lint && npm run typecheck && npm run test
```

For UI changes, also run `npm run dev` and check the screen in a browser.
Co-locate tests as `*.test.ts(x)` next to the code.

## Git

Don't commit or push unless the user asks. Use conventional commit prefixes
(`feat:`, `fix:`, `chore:`, `docs:`).
