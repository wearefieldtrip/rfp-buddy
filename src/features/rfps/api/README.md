# RFP data access (deferred)

Not built yet. Today all RFP data comes from `../data/rfpFixtures.ts`.

**Planned:** Supabase queries and mutations for RFPs, exposed through TanStack
Query hooks in `../hooks/`. Add TanStack Query in the same change that adds this
real async data source, not before.

When this lands:

- Page components should stop importing fixtures directly. Keep fixtures for
  tests and local seeding only.
- Validate responses at the boundary with a schema library (see
  `src/lib/validation/README.md`).
- Keep the `Rfp` type in `../types.ts` as the single domain shape.
