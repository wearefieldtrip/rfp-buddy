# RFP data access (deferred)

Not built yet. Today RFP data comes from the repository in `../repository/`,
which merges `../data/rfpFixtures.ts` with browser-only prototype storage.

**Planned:** Supabase queries and mutations for RFPs, exposed through TanStack
Query hooks in `../hooks/`. Add TanStack Query in the same change that adds this
real async data source, not before.

When this lands:

- Implement the same `RfpRepository` operations against Supabase, so pages keep
  using `useRfpData()` / `useRfpRepository()`. Remove `localRfpStore.ts`.
  Keep fixtures for tests and local seeding only.
- Validate responses at the boundary with a schema library (see
  `src/lib/validation/README.md`).
- Keep the `Rfp` type in `../types.ts` as the single domain shape.
