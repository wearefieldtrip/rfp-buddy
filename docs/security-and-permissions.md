# Security and permissions

> **Today:** no auth, no data store, and no integrations. Fixture data is
> fictional. The principles below govern how auth, the data store, and
> integrations get built later.

## Principles

1. **No secrets in the repo, ever.** That covers API keys, OAuth client secrets,
   refresh tokens, service-role keys, and production URLs with credentials.
   `.env.example` lists variable _names_ only. Local values go in `.env.local`,
   which git ignores.
2. **The browser is untrusted.** The frontend may hold only the Supabase URL and
   anon key. Everything privileged, such as Google API calls, AI calls, and
   service-role queries, runs server-side in Supabase Edge Functions.
3. **The database enforces authorization.** Every table has Row Level Security.
   Hiding a button in the UI is a UX courtesy, not a control.
4. **Least privilege.** Request the narrowest Google OAuth scopes that work
   (prefer `drive.file` over full `drive`), and use the narrowest role for each
   task.
5. **Audit everything external.** Every external write (Drive, Docs, Slides,
   email) is logged with the actor, the target, and the human confirmation that
   authorized it.
6. **No real data in dev or test.** Fixtures and seeds are fictional.

## Authentication (planned)

- Supabase Auth with Google sign-in.
- Access limited to Fieldtrip's Google Workspace domain, checked server-side and
  not only through the hosted-domain hint.
- A new user gets `viewer` until an admin assigns a role.

## Roles (planned)

The vocabulary is defined in `src/lib/permissions/roles.ts`. Nothing enforces it yet.

| Capability                                               | admin | lead | contributor | viewer |
| -------------------------------------------------------- | :---: | :--: | :---------: | :----: |
| View pipeline and RFPs                                   |   ✓   |  ✓   |      ✓      |   ✓    |
| Create or edit RFPs, requirements, questions, and drafts |   ✓   |  ✓   |      ✓      |        |
| Record go/no-go and submission approval                  |   ✓   |  ✓   |             |        |
| Approve content for reuse                                |   ✓   |  ✓   |             |        |
| Confirm external actions (create Docs, send questions)   |   ✓   |  ✓   |     ✓*      |        |
| Manage users and roles                                   |   ✓   |      |             |        |

\* Contributors can confirm only actions on RFPs they are assigned to. To be
settled when the feature is built.

## Google Drive (planned)

- Drive is where files live, and the app keeps references (file ID, name,
  modified time).
- OAuth tokens are stored and used only server-side.
- The app never changes Drive sharing settings on its own.
- Read access to a file is checked with the user's own Google identity, so the
  app never widens who can see a document.

## Supabase (planned)

- Migrations live in `/supabase/migrations`, each reviewed like code.
- RLS policies are tested in CI once the database exists.
- The service-role key exists only in Edge Function secrets.
