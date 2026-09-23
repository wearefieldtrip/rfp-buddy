# AI guardrails

> **Today there is no AI in the app.** These rules apply to every AI feature we
> add later. They are product requirements, not suggestions.

## 1. Ground every output in sources

- Every extracted fact, requirement, score rationale, or drafted claim cites its
  source: the document, the page or section, and a quoted excerpt.
- An output without a citation is shown as **Needs review** and cannot be accepted
  as-is.
- Drafts may draw only on (a) the RFP's own documents and (b) content-library items
  whose reuse status is `approved`.

## 2. Never invent information

- If the source doesn't state a value (deadline, budget, contact, requirement),
  the output is **Not found**. A plausible guess is never acceptable.
- If the model is unsure, the output is **Needs review** with an explanation.
- The UI shows these labels in the same place a real value would go (see
  `NOT_FOUND_LABEL` and `NEEDS_REVIEW_LABEL`), so a gap is never hidden.
- Prompts must tell the model to answer "Not found" rather than guess, and we
  check this with evaluation cases that deliberately leave values out.

## 3. People decide

- AI output is always a **suggestion** with `origin = ai_suggested`, stored
  separately from values a person has accepted.
- A person accepts, edits, or rejects each suggestion, and the app records who
  did so and when.
- AI never records a go/no-go decision, a submission approval, a content-reuse
  approval, or a compliance sign-off.

## 4. No autonomous external actions

- AI never creates, modifies, shares, or deletes a Drive file, Google Doc, or
  Slides deck on its own.
- AI never sends email or clarification questions, and never submits a proposal.
- Every external action goes through an explicit confirmation step that shows
  exactly what will happen. See ADR 0003.

## 5. Respect content-reuse status

- Only `approved` content can be retrieved for drafting. `needs_review` and
  `restricted` content is filtered out _before_ it reaches the model, not after.
- Drafted text shows which library items it drew on.

## 6. Operational rules

- AI calls run server-side only. API keys never reach the browser or the repo.
- Send the minimum necessary content to the provider. Don't send staff personal
  data that the task doesn't need.
- Log the prompt version, model, inputs (by reference), and outputs for audit.
- Every AI feature ships with evaluation cases covering missing values,
  conflicting sources, and prompt injection in RFP text.
