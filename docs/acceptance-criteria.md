# Acceptance criteria: first release (frontend foundation + RFP workspace)

The first release is accepted when every item below holds. Everything is
frontend-only and runs on fictional fixture data.

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
- [ ] Status uses the lifecycle values (Received, Evaluating, Pursuing, Submitted,
      Closed, Declined, Withdrawn), and Decision uses the pursuit values (Not
      decided, Go, Conditional Go, No-Go, Needs Internal Input). Won and Lost never
      appear as decisions.
- [ ] Closed RFPs show their outcome (Won, Lost, or Unknown) next to the Closed status.
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
- [ ] `/rfps/<unknown>` shows "RFP not found" with a way back, and no workspace tabs.

## RFP workspace (`/rfps/:rfpId/:section?`)

Navigation

- [ ] The header shows the back link, opportunity title, organization, status
      (with outcome when closed), and decision.
- [ ] Tabs, in order: Overview, Sources, Requirements, Fit review, Decision,
      Activity, Upcoming. The tab list scrolls horizontally on narrow screens.
- [ ] Each tab has its own URL (e.g. `/rfps/rfp-001/requirements`), and opening
      that URL directly selects the tab. Overview's URL is `/rfps/:rfpId`.
- [ ] An unknown section redirects to the overview URL.
- [ ] Switching tabs replaces the history entry, so browser Back returns to the
      pipeline rather than the previous tab.
- [ ] Tabs work with the keyboard (arrow keys, Home and End) and show a visible
      focus ring.

Content

- [ ] **Overview:** organization, opportunity, sector, internal owner, lifecycle
      status, pursuit decision, outcome, proposal deadline, question deadline,
      budget, service areas, and scope summary. A missing value the source
      doesn't state shows _Not found_; a value a person hasn't provided or
      confirmed yet shows _Needs review_.
- [ ] **Sources:** name, type, date, and source reference, as plain text with no
      links or file actions. A notice says Google Drive connection and live file
      handling are deferred.
- [ ] **Requirements:** a matrix with Requirement, Type, Source, Owner, Status, and
      Notes columns. Every requirement shows a citation such as "RFP, p. 8, §6
      Evaluation Criteria" or "Addendum 1, §2 …". Status uses Not started, In
      progress, Addressed, At risk, and Needs review. Type includes Clarification.
- [ ] **Fit review:** a notice says the content is illustrative fixture data, not
      an AI assessment. Dimensions appear in exactly this order: Mission
      Alignment, Budget & Value Health, Scope & Boundaries, Timeline & Capacity.
      Each shows a rating, summary, evidence, risks, unknowns, and recommended
      conditions ("None identified" when empty).
- [ ] **Decision:** read-only, with no form or save controls. Shows the decision,
      decision maker, date, and rationale. Conditional Go shows its conditions to
      pursue, and Needs Internal Input shows the input needed. An undecided RFP
      shows "No decision recorded".
- [ ] **Activity:** a notice says it is static fixture history. Events are listed
      newest first, each attributed to a named person. No event implies that AI or
      a live integration acted.
- [ ] **Upcoming:** Questions, Proposal, and Compliance cards explain what will be
      added and state that the integration is deferred. They have no buttons or
      links.
- [ ] rfp-001 (Go), rfp-002 (Needs Internal Input), and rfp-004 (Conditional Go,
      with an addendum citation) have full workspace fixtures. Every other RFP
      shows honest empty states instead of invented content.
- [ ] Wide tables scroll horizontally inside their container, and the page never
      scrolls sideways.

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
