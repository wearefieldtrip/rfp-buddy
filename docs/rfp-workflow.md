# RFP workflow

The planned lifecycle of an RFP in RFP Buddy. The **Status** column in the
pipeline follows these stages (`RFP_STATUSES` in `src/lib/constants/rfp.ts`).
The **Decision** column follows the human decisions made along the way.

Items marked 🔒 are **human approval gates** (ADR 0003): the app cannot move
past them on its own.

## Stages

### 1. Intake: `intake`

- Someone logs the opportunity and links the original RFP file in Drive.
- Key facts are captured: client, title, proposal and question deadlines, budget,
  and owner.
- _AI may:_ extract those facts with citations. Anything it can't find is marked
  "Not found".
- 🔒 A person confirms the extracted facts.

### 2. Fit review: `fit_review`

- Requirements are extracted and reviewed.
- A fit assessment is scored against Fieldtrip's criteria.
- Clarification questions are drafted.
- _AI may:_ suggest requirements, fit scores, and questions, each with citations.
- 🔒 The owner records a **go/no-go decision** with a rationale. The decision
  moves to `pursue` or `no_go`. After `no_go`, the RFP moves to `closed`.
- 🔒 Each clarification question is approved before anyone sends it to the issuer.

### 3. Drafting: `drafting`

- Response sections are outlined from the requirements.
- Approved content-library items are pulled in.
- _AI may:_ draft sections, using only content with `approved` reuse status.
- 🔒 A person confirms before any Google Doc or Slides deck is created or modified.

### 4. Internal review: `internal_review`

- Leadership and editors review the draft.
- The compliance checklist is completed against every requirement.
- _AI may:_ pre-fill compliance statuses with evidence.
- 🔒 A person signs off every compliance item.
- 🔒 The owner gives **submission approval**.

### 5. Submitted: `submitted`

- A person submits outside the app, through the issuer's portal or email. The
  app never submits.
- The submission time and method are recorded.

### 6. Closed: `closed`

- The outcome is recorded as a decision: `won` or `lost`. `no_go` RFPs also end here.
- Debrief notes are logged. Content used in a winning proposal may be nominated
  for the library, and it still needs approval before it can be reused.

## How Status and Decision relate

| Status                                 | Typical decision    |
| -------------------------------------- | ------------------- |
| intake                                 | pending             |
| fit_review                             | pending             |
| drafting / internal_review / submitted | pursue              |
| closed                                 | no_go, won, or lost |

Today the fixtures include RFPs at every stage for display only. No stage
transitions are implemented yet.
