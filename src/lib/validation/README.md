# Validation (deferred)

Not built yet. There are no forms or external data to validate.

**Planned:** Add schema validation (e.g. Zod) together with the first real input
boundary, most likely Supabase-backed RFP intake. Use it for form input
(alongside a form library such as React Hook Form) and for parsing API or AI
responses before they reach the UI.

Until then, status and decision values are constrained by the TypeScript unions
in `src/lib/constants/rfp.ts`.
