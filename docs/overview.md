# RFP Buddy — Developer Overview

The full product spec, scope, architecture, and coding workflow live in
[`CLAUDE.md`](../CLAUDE.md) at the repo root. That file is the source of truth —
this doc only covers what's needed to run the app locally.

## Stack (current)

- Vite + React + TypeScript
- Material UI
- React Router

Supabase, Google Workspace, and Perplexity integrations are not yet wired up.

## Running locally

```bash
npm install
npm run dev
```

## Project structure

```
src/
  components/   reusable UI components (not tied to one feature)
  features/     feature-specific code, one folder per feature
  services/     API clients and external integration code (added as needed)
```
