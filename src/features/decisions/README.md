# Decisions (deferred)

Not built yet. Today each fixture RFP has one `decision` value (Not decided, Go,
Conditional Go, No-Go, or Needs Internal Input), and three RFPs have a read-only
fixture `DecisionRecord` shown on the workspace's Decision tab.

**Planned:** An append-only log of human decisions on an RFP: the go/no-go
decision, approval to submit, and recording the final outcome. Each entry
records who decided, when, and why. It is the audit trail behind the Decision badge in the pipeline.

Only a person can create a decision. AI output may be shown alongside for
context, but it is never recorded as the decision. See
`docs/decisions/0003-human-approval-gates.md`.
