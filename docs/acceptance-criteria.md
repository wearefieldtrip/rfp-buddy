# Acceptance criteria: first release (frontend foundation)

The foundation is accepted when every item below holds.

## Tooling

- [ ] `npm install` succeeds on a clean checkout with no environment variables.
- [ ] `npm run dev` serves the app at `http://localhost:5173`.
- [ ] `npm run lint`, `npm run typecheck`, and `npm run test` all pass.
- [ ] The repo contains no secrets, API keys, or credentials.
- [ ] No Supabase, Google, AI, auth, TanStack Query, React Hook Form, Zod, or MUI
      dependency is installed.

## Shell and navigation

- [ ] Desktop layout has a left sidebar and a top header. On narrow screens the
      sidebar collapses into a horizontal nav bar at the top.
- [ ] The sidebar links to RFPs, Question Library, Content Library, Compliance, and
      Settings, and the active link is marked with `aria-current="page"`.
- [ ] `/` redirects to `/rfps`.
- [ ] Non-RFP sections show a clear "not available yet" placeholder.
- [ ] Unknown URLs show a 404 page with a link back to the pipeline.
- [ ] A "Skip to main content" link appears on first Tab.
- [ ] The header says the data is sample data and isn't saved.

## RFP pipeline (`/rfps`)

- [ ] Shows the page title, description, **New RFP** button, and a result-count summary.
- [ ] The table has the columns Client, Opportunity, Status, Decision, Proposal
      deadline, Budget, Owner, and Updated.
- [ ] Status and Decision render as colored badges with text labels, so color is
      never the only signal.
- [ ] A missing deadline or budget shows _Not found_, and a missing owner shows
      _Unassigned_.
- [ ] Search matches client, opportunity, and owner, ignoring case.
- [ ] The Status and Decision filters combine with search.
- [ ] The result count updates, and screen readers announce it (`role="status"`).
- [ ] "Clear filters" appears only while a filter is active, and resets all filters.
- [ ] When nothing matches, an empty state offers "Clear filters".
- [ ] When there are no RFPs at all, an empty state offers "New RFP".
- [ ] Each opportunity name links to `/rfps/:rfpId`.
- [ ] At narrow widths the table scrolls horizontally inside its container, and
      the page itself never scrolls sideways.

## Other routes

- [ ] `/rfps/new` is clearly labeled as a non-persistent preview, and it has no
      inputs that look functional.
- [ ] `/rfps/:rfpId` shows the RFP title, client, badges, and a "workspace coming
      next" placeholder.
- [ ] `/rfps/<unknown>` shows "RFP not found" with a way back.

## Accessibility

- [ ] Every control has an accessible name.
- [ ] Every interactive element can be reached and used with the keyboard,
      including opening and choosing from the selects.
- [ ] Keyboard focus is always visible.
- [ ] Text meets WCAG AA contrast against its background.

## Documentation

- [ ] `CLAUDE.md`, `README.md`, every file in `docs/`, and ADRs 0001–0003 exist
      and describe the implementation accurately. In particular, they don't claim
      the app uses Untitled UI React components.
- [ ] Each deferred module has a README placeholder rather than empty code.
