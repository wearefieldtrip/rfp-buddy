# Product brief: RFP Buddy

## Purpose

Fieldtrip is an agency serving nonprofit, public-health, and civic clients, and
it answers a steady stream of RFPs. Today that work is spread across inboxes,
Drive folders, and spreadsheets. As a result:

- Go/no-go calls are made inconsistently and aren't recorded.
- Requirements and deadlines get missed or re-read many times.
- Good past content is hard to find, and it's unclear what's safe to reuse.
- Final compliance checks happen by memory the night before a deadline.

RFP Buddy gives each opportunity one structured workspace, from intake to
outcome. AI helps read, extract, and draft. People decide.

## Users

| User                                           | Needs                                                                                        |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **Proposal lead**                              | Sees the whole pipeline, owns go/no-go decisions, assigns work, and signs off on submission. |
| **Contributor** (strategist, writer, designer) | Finds requirements, drafts sections, and reuses approved content.                            |
| **Leadership**                                 | Sees pipeline health, win and loss history, and time spent.                                  |
| **Admin**                                      | Manages team access and content-library governance.                                          |

All users are Fieldtrip staff. There is no client-facing surface.

## Principles

1. **Human in the loop.** AI recommends, extracts, and drafts. People make
   decisions and approve every external action.
2. **System of record.** The app owns the structured workflow: requirements,
   decisions, audit trail, and approved-content metadata.
3. **Drive for files.** Original RFPs and generated Docs and Slides stay in Google Drive.
4. **Never invent.** Missing information is shown as _Not found_ or _Needs review_.
5. **Explicit reuse approval.** Content is reused only when it has `approved` status.
6. **Confirmation before external action.** Nothing is created, modified, emailed,
   or submitted outside the app without explicit human confirmation.

## Current scope (this release: foundation)

- App shell with sidebar navigation and header.
- An **RFP pipeline** at `/rfps` built on fictional fixture data, with search,
  status and decision filters, status and decision badges, and empty states.
- Placeholder screens for New RFP, RFP detail, Question Library, Content Library,
  Compliance, and Settings.
- Documentation, ADRs, and engineering guardrails.

## Deferred scope

In roughly this order, and subject to change:

1. Supabase database, auth (Google sign-in limited to the Fieldtrip domain), and
   persisted RFP intake.
2. Linking RFP source files in Google Drive.
3. Requirement extraction, with citations and human review.
4. Fit assessment and a logged go/no-go decision.
5. Question log and question library.
6. Content library with reuse status.
7. Response drafting into Google Docs and Slides, behind confirmation gates.
8. Compliance checklist and submission sign-off.
9. Outcome tracking and reporting.

## Success measures

Measured once persistence exists:

- **Adoption:** every new RFP Fieldtrip considers is logged in RFP Buddy within
  two business days of receipt.
- **Decision hygiene:** 100% of RFPs have a recorded go/no-go decision with an
  owner and a rationale.
- **Deadline safety:** no missed proposal or question deadlines for tracked RFPs.
- **Reuse safety:** zero instances of unapproved content in a submitted proposal.
- **Accuracy:** zero instances of AI-invented values (deadlines, budgets,
  requirements) reaching a submitted proposal.
- **Efficiency:** the team reports less time spent on intake and compliance
  checks. We'll set a baseline once intake is live.
