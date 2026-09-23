# ADR 0001: Product boundary

- **Status:** Accepted
- **Date:** 2026-09-23

## Context

Fieldtrip wants help with the RFP lifecycle: judging fit, tracking questions,
organizing responses, reusing past content, and checking compliance. AI can
speed up much of this, but proposals are legal and financial commitments made
for mission-driven clients. An invented deadline, an unapproved paragraph from
another client's proposal, or an unreviewed submission would cause real harm.

An earlier prototype connected auth, a database, Drive, and an AI provider before
the product boundary was written down. We are restarting from a frontend
foundation so that the boundary comes first.

## Decision

RFP Buddy is an **internal, human-in-the-loop workspace** for Fieldtrip staff.

**In scope:**

- A structured record of each RFP, its requirements, questions, decisions, and
  compliance checks.
- AI assistance that _recommends, extracts, and drafts_, with citations.
- Metadata for reusable content, with an explicit reuse status.
- Preparing artifacts (Docs, Slides) after human confirmation.

**Out of scope:**

- Autonomous decisions (go/no-go, submission, content approval).
- Autonomous external actions (sending, submitting, sharing, editing documents).
- Client-facing access.
- Storing the original files. Drive holds them (ADR 0002).
- Being a general document editor. Writing happens in Google Docs.

## Consequences

- Every AI feature needs a review UI, and its outputs are stored as suggestions.
- The UI must be able to show "Not found" and "Needs review" everywhere a value
  could appear.
- Features are built in dependency order (record → review → assist). The first
  release ships the record UI with no AI.
- Scope requests that cross these lines need a new ADR.
