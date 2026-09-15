# RFP Buddy — Project Context

## What we are building

RFP Buddy is an internal RFP response and proposal-management web application.

The purpose is to help our company decide which RFPs to pursue, organize the response process, reuse approved past content safely, create draft response artifacts, and reduce compliance mistakes before submission.

This is not an autonomous proposal-submission system. AI supports the team, but people make all material decisions and approve all external-facing work.

## Business workflow

The intended end-to-end workflow is:

1. A team member receives or uploads an RFP.
2. The system stores the RFP and related source files in Google Drive.
3. The system extracts key information from the RFP:
   - Buyer/issuing organization
   - RFP title and number
   - Submission deadline and timezone
   - Question deadline and submission rules
   - Evaluation criteria and scoring weights
   - Mandatory requirements and disqualifiers
   - Required attachments, forms, signatures, and certifications
   - Scope, deliverables, pricing instructions, and response formatting rules
4. A proposal lead reviews the extraction and makes a human-approved go/no-go decision.
5. If pursuing:
   - The system recommends clarification questions using an approved question library and RFP-specific analysis.
   - The system creates a Google Doc based on an approved question template.
   - Humans review and send questions themselves.
6. When the issuer provides answers or addenda:
   - The system compares them with the original RFP.
   - It identifies changed requirements, risks, assumptions, and affected response sections.
7. The system creates a proposal response plan and a Google Slides shell based on an approved template and the RFP’s requested outline.
8. The system retrieves only approved, reusable historical proposal content and suggests source-cited draft material.
9. The team completes the proposal in Google Docs and/or Google Slides.
10. The system performs a final compliance review:
    - Maps every RFP requirement to a response location.
    - Flags missing items, unsupported claims, contradictions, stale content, placeholders, missed addenda, and missing attachments.
11. The team submits the final proposal manually.
12. The system records win/loss outcome, value, effort, and debrief notes for future learning.

## Users and roles

The system should support these roles:

- Executive sponsor: Approves strategic go/no-go decisions and major exceptions.
- Proposal manager: Owns the pursuit workflow, requirements matrix, assignments, and final readiness.
- Sales/account lead: Provides buyer context, relationship context, and opportunity value.
- Subject-matter expert: Responds to assigned technical, operational, or delivery requirements.
- Finance reviewer: Reviews pricing, rates, financial assumptions, and margin considerations.
- Legal/security reviewer: Reviews contractual terms, security claims, privacy, and compliance assertions.
- Reviewer: Reviews assigned sections and compliance findings.
- Administrator: Manages templates, rubrics, content-library rules, integrations, and user roles.

## MVP scope

Build the MVP in this order:

1. Authentication and organization/user roles.
2. RFP records and basic pursuit dashboard.
3. RFP detail page.
4. Requirements/compliance matrix.
5. Go/no-go scorecard and approval decision.
6. Google Drive file linking and pursuit folder structure.
7. Human-managed task assignment and review status.
8. Audit events.

The first vertical slice should be:

> An authenticated user can create an RFP record with title, buyer, RFP number, due date, owner, and status; then view it in an RFP list and open an RFP detail page.

Do not implement AI extraction, vector search, Drive ingestion, Docs/Slides generation, or automated drafting until the core data model, auth, RLS, and RFP workflow foundation are working.

## Later phases

### AI intake and extraction

- Upload/select an RFP from Google Drive.
- Parse PDF, DOCX, XLSX, and related files.
- Extract structured RFP data.
- Create a first-pass requirements matrix.
- Require human review of high-risk fields such as deadlines, mandatory requirements, evaluation criteria, page limits, attachments, and submission rules.

### Go/no-go intelligence

- Apply a configurable company rubric.
- Support weighted categories, hard disqualifiers, risks, unknowns, conditions, and manual overrides.
- Show evidence behind every score.
- Use historical pursuit data as contextual evidence, not fake “win probability” certainty.
- Require human approval for the final decision.

### Content library and retrieval

- Use Google Drive as the source of truth for original source files.
- Use Supabase/Postgres as the system of record for metadata, status, permissions, and audit records.
- Use pgvector for semantic retrieval over approved content chunks.
- Use PostgreSQL full-text search plus vector search for hybrid retrieval.
- Retrieve only content that is approved, current, relevant, reusable, and permitted for the active user and pursuit.
- Preserve source file, page/slide, excerpt, approval status, and review date for every retrieved result.

### Questions, Docs, and Slides

- Recommend clarification questions from approved historical question logs plus RFP-specific analysis.
- Generate a Google Doc using a controlled template.
- Analyze issuer answers and addenda for changes and downstream impact.
- Create a Google Slides response shell from a controlled template.
- Use source-cited, approved historical material for drafting suggestions.
- Humans remain responsible for final writing, design, pricing, legal language, and submission.

### Final compliance review

- Map each RFP requirement to a response location, attachment, or unresolved gap.
- Flag mandatory requirements with no evidence of response.
- Flag stale names, dates, client references, expired certifications, empty placeholders, inconsistent facts, and missed addenda.
- Require human sign-off; never claim that a proposal is legally or procurement-compliant with certainty.

## Technology stack

### Frontend

- React
- TypeScript
- Material UI
- React Router
- TanStack Query
- React Hook Form
- Zod

### Database and auth

- Supabase
- PostgreSQL
- Supabase Auth using Google Workspace sign-in
- Supabase Row Level Security on all application-visible tables
- pgvector for embeddings and semantic retrieval
- PostgreSQL full-text search for keyword retrieval

### External integrations

- Google Drive API
- Google Docs API
- Google Slides API
- Google OAuth / Google Cloud project
- Perplexity Agent API for AI extraction, analysis, drafting, and review
- Perplexity embeddings or another approved embedding provider
- Background job system to be selected later, likely Inngest, Trigger.dev, Cloud Tasks, or Cloud Run workers

### Recommended deployment direction

- Frontend: Vite/React initially; deployment choice to be decided later.
- Backend: Server-side API layer. No privileged external API calls from the browser.
- Database/auth: Supabase.
- Source files: Google Drive.
- Async jobs: a queue/job runner, not browser requests.

## Architecture principles

### Systems of record

Supabase is the source of truth for:

- Organizations
- Users and roles
- RFPs
- Pursuit stages
- Requirements
- Tasks
- Decisions
- Approvals
- Content metadata
- Retrieval records
- Win/loss outcomes
- Audit events

Google Drive is the source of truth for:

- Original RFP files
- Addenda
- Question logs
- Generated Google Docs
- Generated Google Slides
- Final proposal artifacts
- Historical source documents

### Security boundaries

- The browser must never call Perplexity APIs directly.
- The browser must never call privileged Google APIs directly.
- The browser must never have access to a Supabase `service_role` key.
- Perplexity API keys, Google OAuth refresh tokens, Google service-account credentials, and Supabase service keys stay server-side only.
- All application business tables exposed to the client must use Supabase RLS.
- Use least-privilege access for Google Drive.
- Do not grant broad Drive access merely for convenience.
- Permission-filter content before it is sent to an LLM.
- Do not rely on a model prompt to protect confidential content.
- Customer-restricted content must be excluded from general retrieval by default.
- Preserve audit events for important workflow actions, generated outputs, approvals, and source retrieval.

### AI boundaries

AI is allowed to:

- Extract and summarize.
- Recommend.
- Draft.
- Rewrite.
- Compare documents.
- Identify gaps, risks, contradictions, and unknowns.
- Retrieve approved, source-cited content through controlled backend tools.

AI is not allowed to:

- Make the final go/no-go decision.
- Send clarification questions.
- Submit a proposal.
- Approve pricing, margin, or commercial terms.
- Approve legal, security, privacy, or contractual claims.
- State a company credential, staff availability, client reference, certification, pricing fact, or security capability without an approved source.
- Retrieve content the user is not authorized to access.
- Mark a proposal “fully compliant” without human review and approval.
- Automatically overwrite human-authored proposal content.

## Core data model

Expected initial tables include:

```text
organizations
profiles
organization_memberships
roles

rfps
rfp_files
rfp_requirements
rfp_tasks
rfp_decisions
rfp_approvals
rfp_addenda
rfp_questions
rfp_response_artifacts

content_documents
content_chunks
content_access
content_reviews

audit_events
notifications
win_loss_debriefs
```

Important data relationships:

```text
Organization
  └── Members
        └── RFPs
              ├── Files
              ├── Requirements
              ├── Tasks
              ├── Decisions
              ├── Approvals
              ├── Questions
              ├── Addenda
              ├── Generated artifacts
              └── Win/loss debrief

Content document
  ├── Content chunks
  ├── Access rules
  ├── Approval/review state
  └── Google Drive source file reference
```

## Requirements matrix rules

Each RFP requirement should eventually include:

- A stable requirement ID.
- Original requirement text.
- RFP source file.
- Page/section/slide citation.
- Requirement type: mandatory, evaluated, administrative, technical, pricing, legal, security, informational.
- Priority/risk level.
- Assigned owner.
- Internal due date.
- Status: open, drafted, in review, complete, blocked, not applicable.
- Response location: Google Doc section, Google Slide, attachment, or other artifact.
- Linked clarification question or issuer answer, if applicable.
- Source evidence and notes.
- Review/approval history.

A requirement should not be considered complete merely because an AI says it is addressed. It needs a linked response location and a human-reviewed status.

## Development practices

- Use TypeScript for all application code.
- Use Zod schemas at API boundaries and for AI structured outputs.
- Keep feature-specific code under `src/features`.
- Keep reusable UI components under `src/components`.
- Keep API clients and external integration code under `src/services` or `src/lib`.
- Use React Query for server-state fetching and mutation.
- Use React Hook Form + Zod for forms.
- Create each database change as a new migration in `supabase/migrations`.
- Never edit old production migrations after they have been applied.
- Add tests for business rules, authorization-sensitive behavior, and data transformations.
- Prefer small vertical slices over broad scaffolding.
- Use explicit error states, loading states, empty states, and permission-denied states in the UI.
- All long-running work must run through a background job process and be idempotent.
- Retries must not create duplicate RFP records, tasks, Docs, Slides, notifications, or audit events.
- Do not introduce a dependency, framework, or infrastructure service without explaining why it is necessary.

## Coding workflow

Before making a broad change:

1. Read this file.
2. Read the relevant files under `docs/`.
3. Inspect existing code, schema, and migrations.
4. Propose a concise implementation plan.
5. Identify database, security, RLS, API, migration, test, and operational implications.
6. Wait for approval before broad refactors or schema changes.

For normal focused tasks:

1. Explain what files will change.
2. Make the smallest coherent change.
3. Run lint, typecheck, and relevant tests.
4. Summarize changes, known limitations, and how to test.
5. Do not commit or push unless explicitly asked.

## Current status

- GitHub repository has been created and cloned locally.
- Development is happening in VS Code.
- The project should begin as a React + TypeScript + Material UI app.
- Supabase, Perplexity API, and Google Workspace integrations have not yet been implemented.
- The immediate priority is to scaffold the application, establish documentation, then create the authentication and RFP-record foundation.

## Immediate next task

First inspect the repository.

Then propose the smallest setup plan to:

1. Confirm whether Vite React + TypeScript has already been scaffolded.
2. Install/configure Material UI if needed.
3. Create the project folder structure.
4. Create basic project documentation under `docs/`.
5. Create a clean application shell with a simple `RFP Buddy` landing/dashboard page.
6. Ensure `.gitignore` excludes environment files and credentials.
7. Do not connect Supabase or any external API until the initial UI foundation is reviewed.
