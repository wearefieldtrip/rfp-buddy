# ADR 0002: Google Drive stores artifacts, Supabase is the future system of record

- **Status:** Accepted. Implementation is deferred.
- **Date:** 2026-09-23

## Context

Fieldtrip already works in Google Workspace. RFP PDFs, addenda, and proposal
drafts live in Drive, and the team writes in Google Docs and Slides. RFP Buddy
also needs structured, queryable data that Drive can't provide: status,
requirements, decisions, audit history, and reuse approvals.

## Decision

- **Google Drive** is the **artifact store**. It holds the original RFP files and
  the Docs and Slides we generate. The app keeps references to them (file ID,
  name, modified time) and never copies their contents into its own storage.
- **Supabase** (Postgres, Auth, Edge Functions) will be the **system of record**
  for structured workflow data: RFPs, requirements, fit assessments, decisions,
  questions, content metadata and reuse status, compliance checks, and audit events.
- Neither is integrated in the foundation release. The app runs on local fixtures
  until the data layer is scheduled.

## Consequences

- One source of truth for each kind of data: files in Drive, structure in Postgres.
- Access to files follows the user's own Drive permissions, so the app never
  widens who can see a document.
- Google OAuth tokens and Drive writes must run server-side (Edge Functions).
- Supabase Storage is not used for RFP files.
- When the data layer lands, add `@supabase/supabase-js`, TanStack Query, and
  React Hook Form + Zod together with the first persisted feature (RFP intake).
  Don't add them earlier.
- If Drive files move or are deleted, references break. The app must show that
  as "Not found" rather than failing silently.
