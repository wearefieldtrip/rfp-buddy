# RFP Buddy — Developer Overview

The full product spec, scope, architecture, and coding workflow live in
[`CLAUDE.md`](../CLAUDE.md) at the repo root. That file is the source of truth —
this doc only covers what's needed to run the app locally.

## Stack (current)

- Vite + React + TypeScript
- Material UI
- React Router
- Supabase (Postgres, Auth with Google sign-in, RLS)

Google Workspace OAuth config and Perplexity integration are not yet wired up.

## Auth model (current)

Single-tenant: any user signing in with a `@hellofieldtrip.com` Google account
gets a `profiles` row created automatically (see
`supabase/migrations/20260915190248_init_organizations_and_auth.sql`) and can
use the app. There is no organization or role concept yet — add those back if
the product ever needs to support more than one company or differentiated
permissions.

## Running locally

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project URL + anon key
npm run dev
```

## Database changes

```bash
supabase migration new <name>   # create a new migration
supabase db push                # apply local migrations to the linked project
```

## Project structure

```
src/
  components/   reusable UI components (not tied to one feature)
  features/     feature-specific code, one folder per feature
    auth/       Supabase auth: sign-in, session state, protected routes
  lib/          external client setup (Supabase)
supabase/
  migrations/   database schema, versioned
```
