# RFP workflow

The planned lifecycle of an RFP in RFP Buddy. It is tracked with three separate,
typed fields defined in `src/lib/constants/rfp.ts`:

| Field                          | Question it answers                | Values                                                                 |
| ------------------------------ | ---------------------------------- | ---------------------------------------------------------------------- |
| **Status** (`RFP_STATUSES`)    | Where is the RFP in our process?   | Received, Evaluating, Pursuing, Submitted, Closed, Declined, Withdrawn |
| **Decision** (`RFP_DECISIONS`) | What did a person decide about it? | Not decided, Go, Conditional Go, No-Go, Needs Internal Input           |
| **Outcome** (`RFP_OUTCOMES`)   | How did it end?                    | Won, Lost, Declined, Withdrawn, Unknown, Not applicable                |

Keeping them separate means the pipeline and the RFP workspace always read the
same values and can't disagree. Won and Lost are outcomes, never decisions.

Items marked 🔒 are **human approval gates** (ADR 0003): the app cannot move
past them on its own.

## Stages

### 1. Received: `received`

- Someone logs the opportunity and links the original RFP file in Drive.
- Key facts are captured: client, title, proposal and question deadlines, budget,
  and owner.
- _AI may (later):_ extract those facts with citations. Anything it can't find is
  marked "Not found".
- 🔒 A person confirms the extracted facts.
- Decision: **Not decided**. Outcome: **Not applicable**.

### 2. Evaluating: `evaluating`

- Requirements are extracted and reviewed, each with a source citation.
- A fit review covers four dimensions, always in this order: Mission Alignment,
  Budget & Value Health, Scope & Boundaries, Timeline & Capacity.
- Clarification questions are drafted.
- 🔒 The owner records a **pursuit decision** with a rationale:
  - **Go:** pursue. The RFP moves to Pursuing.
  - **Conditional Go:** pursue only if the recorded conditions are met. The RFP
    moves to Pursuing, and the conditions stay visible on the Decision tab.
  - **Needs Internal Input:** the RFP stays in Evaluating until the named input
    (for example, a leadership call) is resolved.
  - **No-Go:** don't pursue. The RFP moves to Declined.
- 🔒 Each clarification question is approved before anyone sends it.

### 3. Pursuing: `pursuing`

- Response sections are outlined from the requirements and drafted, using only
  content-library items with `approved` reuse status.
- The compliance checklist is completed against every requirement.
- 🔒 A person confirms before any Google Doc or Slides deck is created or modified.
- 🔒 A person signs off every compliance item and gives submission approval.

### 4. Submitted: `submitted`

- A person submits outside the app, through the issuer's portal or email. The app
  never submits.
- Outcome: **Unknown** until the issuer responds.

### 5. Closed: `closed`

- The issuer's result is recorded as the outcome: **Won** or **Lost**, or
  **Unknown** if no result ever arrives.
- Debrief notes are logged. Content from a winning proposal may be nominated for
  the library, and it still needs approval before reuse.

### Exits

- **Declined** (`declined`): Fieldtrip decided No-Go. Outcome: **Declined**.
- **Withdrawn** (`withdrawn`): pursuit stopped after it began, because Fieldtrip
  withdrew or the issuer cancelled the RFP. Outcome: **Withdrawn**.

## Allowed combinations

Defined once in `src/features/rfps/workflowRules.ts`
(`ALLOWED_DECISIONS_BY_STATUS`, `normalizeOutcome`) and used by the repository,
the intake and Overview edit forms (including their hint text), and
`fixtures.test.ts`.

| Status     | Decision                                              | Outcome               |
| ---------- | ----------------------------------------------------- | --------------------- |
| Received   | Not decided                                           | Not applicable        |
| Evaluating | Not decided, Needs Internal Input, Go, Conditional Go | Not applicable        |
| Pursuing   | Go, Conditional Go                                    | Not applicable        |
| Submitted  | Go, Conditional Go                                    | Unknown               |
| Closed     | Go, Conditional Go                                    | Won, Lost, or Unknown |
| Declined   | No-Go                                                 | Declined              |
| Withdrawn  | Go, Conditional Go, or No-Go                          | Withdrawn             |

### In the prototype

- **New RFPs** default to Received, Not decided, Not applicable. Intake may set a
  different status and decision; an incompatible pair is a form error, never a
  silent change.
- **Outcome is never entered by hand.** When status changes, the repository sets
  the outcome: Received, Evaluating, Pursuing → Not applicable; Submitted →
  Unknown; Closed → keeps Won or Lost if already recorded, otherwise Unknown;
  Declined → Declined; Withdrawn → Withdrawn.
- **Decision** can be set at intake only. The Overview edit form can change the
  status but not the decision, and rejects a status the current decision doesn't
  allow. A dedicated decision-record feature will own later decision changes.
- No other stage transitions or approval gates are implemented yet.
