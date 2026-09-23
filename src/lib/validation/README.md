# Validation

Zod is installed. Schemas live with the feature that owns the data rather than
here:

- `src/features/rfps/form/rfpFormSchema.ts`: intake and Overview edit forms
  (used through React Hook Form's `zodResolver`).
- `src/features/rfps/repository/localRfpStore.ts`: validates everything read
  back from browser storage before it's used.

Put a schema here only if several features genuinely share it. When Supabase
arrives, validate API responses at the repository boundary the same way.
