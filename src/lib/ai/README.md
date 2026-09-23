# AI (deferred)

Not built yet. The app calls no AI API.

**Planned:** Server-side calls (never from the browser, and never with keys in
the bundle) for extraction, fit scoring, question drafting, and response drafting.

Every AI feature must follow `docs/ai-guardrails.md`:

- Ground every output in source material and include citations.
- Return "Not found" or "Needs review" instead of inventing values.
- Only suggest. Every output is a proposal that a person accepts or rejects.
- Take no external actions on its own: no sending, submitting, or document
  changes without human confirmation.
- Use only content-library items with `approved` reuse status.
