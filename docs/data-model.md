# Conceptual data model

> **This is a concept, not a schema.** No database exists yet. Treat everything
> here as a starting point for the Supabase design, not a contract.

## What exists today (fixtures + browser-only prototype storage)

`src/features/rfps/types.ts` defines TypeScript types for a subset of the
entities below. Their unions live in `src/lib/constants/rfp.ts` and
`src/lib/constants/rfpWorkspace.ts`. Records come from bundled fixtures and from
browser-only prototype storage (see "Browser storage shape" below). No database
exists.

| Type             | Concept below  | Notes                                                                                                                          |
| ---------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `RfpFields`      | RFP            | Core fields: client, opportunity, sector, status, decision, outcome, deadlines, budget, owner, service areas, scope, updatedAt |
| `Rfp`            | RFP            | `RfpFields` plus `dataOrigin` (`fixture` \| `local`) and `isLocallyEdited`, after merging                                      |
| `RfpBudget`      | RFP budget     | `minUsd` and `maxUsd` (whole dollars or `null`) and an optional `note` such as "Over 3 years"                                  |
| `RfpWorkspace`   | RFP (detail)   | Read-only review detail: the collections below. Fixture-only                                                                   |
| `SourceDocument` | SourceDocument | Name, type, date, and a plain-text source reference. No Drive IDs yet                                                          |
| `RfpRequirement` | Requirement    | Every requirement has a required `citation` (document + location)                                                              |
| `FitReview`      | FitAssessment  | Four fixed dimensions with a qualitative rating                                                                                |
| `DecisionRecord` | Decision       | Details only. The decision value itself is `Rfp.decision`                                                                      |
| `ActivityEvent`  | AuditEvent     | Static, human-attributed history                                                                                               |

## Entities

### Organization

The client that issues RFPs: a nonprofit, public-health agency, or civic body.

- name, sector (`nonprofit` | `public_health` | `civic` | `foundation` | `education` | `other`), website, notes
- relationships: has many RFPs and contacts

### User / Membership

A Fieldtrip staff member and their role in the workspace.

- email (Fieldtrip domain), display name, role (`admin` | `lead` | `contributor` | `viewer`)

### RFP

One opportunity.

- organization, title, sector (optional; unselected shows "Needs review")
- `status`: lifecycle state (`received` | `evaluating` | `pursuing` | `submitted` | `closed` | `declined` | `withdrawn`)
- `decision`: the human pursuit decision (`not_decided` | `go` | `conditional_go` | `no_go` | `needs_internal_input`), taken from the latest _Decision_ record
- `outcome`: final disposition (`won` | `lost` | `declined` | `withdrawn` | `unknown` | `not_applicable`)
- See `docs/rfp-workflow.md` for which combinations are allowed
- proposal deadline, question deadline, and budget (`minUsd`, `maxUsd`, `note`)
  as stated. Each is nullable, and null is shown as "Not found".
- service areas and scope summary: internal details; empty shows "Needs review".
- owner (user)
- source documents: Drive file references, not copies
- created/updated timestamps and actors

### SourceDocument

A pointer to a file in Google Drive (the original RFP, addenda, or attachments).

- Drive file ID, name, MIME type, version or modified time, linked-by user

### Requirement

A discrete obligation extracted from the RFP.

- RFP, type (`submission` | `format` | `eligibility` | `deliverable` | `evaluation` | `contractual` | `clarification`), text
- `clarification` covers material unknowns that need a client answer, an addendum, or internal interpretation before the team can responsibly proceed
- **citation**: source document and location (page or section). A quoted excerpt comes later.
- `status`: `not_started` | `in_progress` | `addressed` | `at_risk` | `needs_review`
- owner, notes
- origin: `human` | `ai_suggested`

### FitAssessment

A structured review that informs the go/no-go decision.

- RFP, reviewer, reviewed at, origin
- Four dimensions, always in this order: Mission Alignment, Budget & Value Health,
  Scope & Boundaries, Timeline & Capacity
- Per dimension: rating (`strong` | `moderate` | `weak` | `needs_review`), summary,
  evidence, risks, unknowns, and recommended conditions

### Decision

An append-only log of human decisions.

- RFP, type (`go_no_go` | `submit_approval` | `outcome`), value, rationale, decided by, decided at
- For `go_no_go`: conditions to pursue (required for Conditional Go) and input
  needed (required for Needs Internal Input)
- Only a person can create one.

### Question

A clarification question for the issuer.

- RFP, text, status (`draft` | `approved` | `submitted` | `answered`), answer, due date
- origin, approved by

### ContentItem

Metadata for reusable proposal content whose source lives in Drive.

- title, type (bio, case study, methodology, boilerplate), Drive reference, tags
- **`reuse_status`: `approved` | `needs_review` | `restricted`.** Only `approved` may be reused.
- approved by, approved at, expires at, restrictions (e.g. client-confidential)

### ComplianceCheck

A pre-submission checklist item tied to a requirement.

- RFP, requirement, status (`met` | `not_met` | `needs_review`), evidence, checked by, checked at

### AuditEvent

An immutable record of every meaningful change and every external action.

- actor, action, entity, before/after, timestamp, and, for external actions, the confirmation record

## Cross-cutting rules

- Every AI-originated value carries `origin = ai_suggested` and a citation. It
  becomes authoritative only after a person reviews it.
- Nullable means _unknown_. The UI shows "Not found" or "Needs review" and never
  a default.
- Every table gets RLS scoped to the Fieldtrip organization and to role.

## Browser storage shape (prototype only)

Stored under `localStorage["rfp-buddy.local-rfps.v1"]` and validated with Zod on
every read (`src/features/rfps/repository/localRfpStore.ts`):

```ts
{
  version: 1,
  created: LocalRfpRecord[],            // full RfpFields; id starts with "local-"
  overrides: Record<fixtureId, Override> // editable fields + normalized outcome + updatedAt
}
```

- Overrides never include `decision`; a fixture's decision can't be changed
  locally.
- Anything that fails to parse or validate is ignored as corrupted and replaced
  on the next save or reset.
- This shape is temporary and will not be migrated automatically into Supabase.
  It holds fictional prototype data only and is not a security boundary.
