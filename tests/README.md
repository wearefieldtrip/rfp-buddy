# Tests

Unit and component tests sit next to the code they test (`*.test.ts` /
`*.test.tsx` under `src/`) and run with Vitest and React Testing Library:

```bash
npm run test         # single run
npm run test:watch   # watch mode
```

Shared test setup is in `src/test/`: `setup.ts` for jest-dom matchers, and
`render.tsx` for `renderWithRouter`.

This top-level folder is reserved for tests that span the whole app, such as
end-to-end browser tests. None exist yet. Add them, along with a runner such as
Playwright, when there are real user flows to protect.
