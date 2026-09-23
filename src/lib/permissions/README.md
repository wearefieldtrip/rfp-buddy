# Permissions

`roles.ts` defines the role vocabulary (`AppRole`) only. **Nothing enforces it
yet.** There is no auth, so every screen is open.

**Planned:** Roles are assigned per user within the Fieldtrip organization and
enforced by Supabase Row Level Security. The UI may hide actions a role can't
take, but that is a convenience, not a security boundary.

See `docs/security-and-permissions.md` for the intended role matrix.
