# ADR 0003: Human approval gates

- **Status:** Accepted
- **Date:** 2026-09-23

## Context

RFP Buddy will be able to act outside itself: creating and editing Google Docs
and Slides, sending clarification questions, and preparing submissions. It will
also use AI that can produce confident but wrong output. Undoing a mistaken
external action, such as a sent email or an overwritten document, can be costly
or impossible.

## Decision

Some actions require an **explicit human confirmation step**, in the UI, at the
moment the action happens. Neither AI nor background automation can bypass it.

### Gated decisions (recorded by a person)

- Go/no-go on an RFP
- Approval to submit
- Content reuse approval (`approved` status)
- Compliance sign-off
- Accepting AI-suggested requirements, facts, or scores as authoritative

### Gated external actions (confirmed by a person each time)

- Creating, modifying, sharing, or deleting any Drive file, Doc, or Slides deck
- Sending any email or clarification question
- Any submission-related action

### What a confirmation step must do

- Show exactly what will happen: the target, the content or diff, and the recipients.
- Require a deliberate action (a clearly labeled button, never a default or an
  auto-submit).
- Be recorded as an audit event with the actor and a timestamp.
- Be cancellable with no side effects.

## Consequences

- There is no "auto-send", "auto-submit", or "auto-approve" feature, and no
  background job may perform a gated action.
- Every server endpoint that performs a gated action must require a confirmation
  record and reject calls without one.
- Workflows take a few more clicks. We accept that in exchange for safety and
  accountability.
- In the foundation release, `/rfps/new` is explicitly non-persistent, so no
  gated actions exist yet.
