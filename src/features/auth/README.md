# Auth (deferred)

Not built yet. The app has no sign-in, and every screen is open.

**Planned:** Supabase Auth with Google sign-in, limited to Fieldtrip's Google
Workspace domain. This module will own the session provider, a `useSession`
hook, and a protected-route wrapper.

**Before building:** read `docs/security-and-permissions.md` and
`docs/decisions/0002-drive-and-database.md`. Don't add auth libraries or OAuth
client IDs until that work is scheduled.
