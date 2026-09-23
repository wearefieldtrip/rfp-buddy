# Decisions (deferred)

Not built yet. Today `decision` is a single field on each fixture RFP.

**Planned:** An append-only log of human decisions on an RFP: pursue or no-go,
approval to submit, and the final outcome. Each entry records who decided, when,
and why. It is the audit trail behind the Decision badge in the pipeline.

Only a person can create a decision. AI output may be shown alongside for
context, but it is never recorded as the decision. See
`docs/decisions/0003-human-approval-gates.md`.
