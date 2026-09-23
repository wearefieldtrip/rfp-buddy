# Acceptance criteria: first release (frontend prototype)

The first release is accepted when every item below holds. Everything is
frontend-only: fictional fixtures plus browser-only prototype storage.

## Tooling

- [ ] `npm install` succeeds on a clean checkout with no environment variables.
- [ ] `npm run dev` serves the app at `http://localhost:5173`.
- [ ] `npm run lint`, `npm run typecheck`, and `npm run test` all pass.
- [ ] The repo contains no secrets, API keys, or credentials.
- [ ] No Supabase, Google, AI, auth, TanStack Query, or MUI dependency is
      installed. React Hook Form, Zod, and `@hookform/resolvers` are the only form
      dependencies.

## Shell and navigation

- [ ] Desktop layout has a left sidebar and a top header. On narrow screens the
      sidebar collapses into a horizontal nav bar at the top.
- [ ] The sidebar links to RFPs, Question Library, Content Library, Compliance, and
      Settings, and the active link is marked with `aria-current="page"`.
- [ ] `/` redirects to `/rfps`.
- [ ] Non-RFP sections show a clear "not available yet" placeholder.
- [ ] Unknown URLs show a 404 page with a link back to the pipeline.
- [ ] A "Skip to main content" link appears on first Tab.
- [ ] The header says this is a prototype and data is saved only in this browser.

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
      budget (with note), service areas, and scope summary, following the
      missing-value rules below.
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

## RFP intake and browser-only persistence

Intake (`/rfps/new`)

- [ ] **New RFP** on the pipeline opens a real intake form, with the notice:
      "Prototype data is stored only in this browser. It is not shared with your
      team and will be replaced by secure team storage in a future release."
- [ ] Fields: Organization / client (required, 2–120), Opportunity title
      (required, 3–180), Sector (optional), Lifecycle status (required, default
      Received), Pursuit decision (required, default Not decided), Proposal and
      Question deadlines (optional dates), Budget minimum and maximum (optional
      whole dollars ≥ 0, maximum not below minimum), Budget context / note
      (optional, ≤ 240), Internal owner (optional, 2–120), Service areas
      (optional, multi-select), Scope summary (optional, ≤ 1,000). Outcome isn't
      collected.
- [ ] An incompatible status and decision is a form error, using the rules in
      `workflowRules.ts`. The decision field shows which decisions the status
      allows.
- [ ] Invalid submit shows inline errors (`aria-invalid`, described by the error
      text) and a focused error summary whose links move focus to each field.
      Nothing is saved.
- [ ] "Save RFP locally" stores the RFP, opens its workspace, and replaces the
      intake history entry so Back returns to the pipeline. The new RFP appears in
      the pipeline.

Persistence

- [ ] Created and edited records survive a browser refresh.
- [ ] Pages and components never touch `localStorage`; only the repository's
      store module does, using the versioned key `rfp-buddy.local-rfps.v1`.
- [ ] Editing a built-in sample stores a local override; the fixture source data
      never changes.
- [ ] Blocked storage or unreadable stored data shows a non-blocking notice, and
      the built-in samples stay available.

Overview edit

- [ ] "Edit overview" edits the same fields as intake except the decision, which
      is shown read-only ("Managed on the Decision tab"). All other workspace
      tabs stay read-only.
- [ ] A status the current decision doesn't allow is rejected with a form error.
- [ ] Saving updates the Overview and the pipeline row, announces "Overview saved
      in this browser.", and returns focus to "Edit overview".
- [ ] Outcome is normalized from status (see `docs/rfp-workflow.md`).

Origin labels and reset

- [ ] Records are labeled **Built-in sample**, **Edited in this browser**, or
      **Stored in this browser** in the workspace header. The pipeline labels the
      last two.
- [ ] Browser-local records show: "This RFP is stored locally in this browser and
      is not shared with your team."
- [ ] A "Local prototype data" panel below the pipeline table shows the prototype
      notice and counts, and offers "Reset local prototype data".
- [ ] Reset asks for confirmation in a dialog that says local RFPs and edits in
      this browser will be removed, built-in samples remain, and it can't be
      undone. Cancel has initial focus. After reset, every fixture is intact.

Missing values

- [ ] Blank proposal deadline, question deadline, or budget shows _Not found_.
      Blank owner, sector, service areas, or scope summary shows _Needs review_.
      Budget notes appear after the amount.

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
