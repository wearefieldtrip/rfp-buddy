# Content library (deferred)

Not built yet. The **Content Library** sidebar link opens a placeholder.

**Planned:** Metadata for reusable proposal content, such as bios, case studies,
methodology sections, and past answers. The source files stay in Google Drive.
Each item carries an explicit **reuse status**:

| Status                                            | Can it be reused? |
| ------------------------------------------------- | ----------------- |
| `approved`                                        | Yes               |
| `needs_review`                                    | No                |
| `restricted` (client-confidential, expired, etc.) | No                |

Anything without `approved` status is never suggested or inserted into a
response, whether by AI or by the UI. See `docs/ai-guardrails.md`.
