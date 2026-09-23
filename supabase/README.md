# Supabase (deferred)

This folder holds a place for the future Supabase project. **Nothing here is
configured.** There is no `config.toml`, no migrations, and no linked project.

When Supabase is introduced:

- Add SQL migrations to `migrations/`, one change per file, and never edit one
  that has already been applied.
- Put local seed data in `seed/`, built from the fictional fixtures in
  `src/features/rfps/data/`.
- Enable Row Level Security on every table.
- Keep project credentials out of the repo. See `.env.example`.

See `docs/data-model.md` for the conceptual entities.
