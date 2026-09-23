# Google Workspace integration (deferred)

Not built yet. There is no Google OAuth, Drive, Docs, or Slides access.

**Planned:**

- **Drive:** the store for original RFP files and for generated artifacts. The app
  keeps file IDs and links, not copies.
- **Docs and Slides:** generating proposal drafts and decks from approved content.

Rules for when this lands:

- Run OAuth token exchange and any Drive writes on the server (e.g. a Supabase
  Edge Function), never in the browser bundle.
- Put every create, modify, share, or send action behind an explicit human
  confirmation step. See `docs/decisions/0003-human-approval-gates.md`.
- Request the narrowest OAuth scopes that work.
