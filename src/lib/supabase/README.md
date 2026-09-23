# Supabase client (deferred)

Not built yet. The app has no database and no Supabase dependency.

**Planned:** A single typed Supabase client (`@supabase/supabase-js`) with
generated database types. It will read only the public URL and anon key from
`import.meta.env`.

Rules for when this lands:

- Never put a service-role key in frontend code or in `.env.example` values.
- Enforce authorization with Row Level Security in Postgres, not in the UI.
- Migrations go in `/supabase/migrations`. See `/supabase/README.md`.
